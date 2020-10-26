const express = require('express')
var connection = require('../Databases/connect');
const router = express.Router()
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

// Create Transport
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))


// REset Password Route for Forget Password with token

router.post('/reset-password',(req,res)=>{
    email=req.body.email;
var Result;
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
      //  User.findOne({email:req.body.email})
      connection.execute('SELECT `email` FROM `users` WHERE `email`=?', [email])
    .then(([rows]) => {
        if(rows.length == 0){
            Result.status=422;
            Result.msg="User dont exists with that email"
         //   return Promise.reject('This E-mail already in use!');
         return res.send(Result);

        }
       

// execute the UPDATE statement
console.log(req.body)
        reset_token = token
        expire_token = Date.now() + 3600000;
        let sql = `UPDATE users
        SET reset_token = ?,
        expire_token = ?
        WHERE email = ?`;

let data = [reset_token,expire_token, email];
        connection.query(sql, data, (error, results, fields) => {
            if (error){
                Result.status=422;
                Result.msg=error;
             return res.send(Result);
            }
            else{
            console.log('Rows affected:', results.affectedRows);
            Result.status=200;
            Result.msg="Successful Now You Can Login"
          res.send(Result);}
            }).then((result)=>{
            transporter.sendMail({
                to:email,
                from:"umairdhillun.uh@gmail.com",
                subject:"Password Reset Link",
                html:` <h3>You requested for Password Reset for Your Timetable Management System Account</h3>
                <h4>click in this <a href="http://localhost:3000/new-password/${token}">link</a> 
                to reset password</h4>`
            }).catch(error => console.log(error))

            Result.status=200;
            Result.msg="Successful Now You Can Login"
         return res.send(Result);        })
       
        

        })
    })
})

// New Password Route
router.post('/new-password',(req,res)=>{
    console.log(req.body)
    const newPassword = req.body.password
    const sentToken = req.body.token

    connection.execute('SELECT * FROM `users` WHERE `reset_token`=?', [sentToken])
    .then(([rows]) => {
        console.log(rows)
        if(rows.length === 0 && rows[0].expire_token > Date.now){
          console.log("rows length 0")
         //   return Promise.reject('This E-mail already in use!');
         return res.send({msg:"Try again session expired"})

        } bcrypt.hash(newPassword,12).then(hashedpassword=>{
        let sql = `UPDATE users
        SET password = ?
        WHERE reset_token = ?`;
    
    let data = [hashedpassword, sentToken];
    // execute the UPDATE statement
connection.query(sql, data, (error, results, fields) => {
    if (error){
         res.send({msg:"An Error Ocurred! Please Try Again"})
    }
    else{
    console.log('Rows affected:', results.affectedRows);
    
     res.send({msg:"Password Reset Succefull. Now You can Login"})
}
});
});
    })
});

// Update/Change Password WHile Logged IN
router.post('/change-password',(req,res)=>{
    console.log(req.body)
    password=req.body.password;
    email=req.body.email;
    bcrypt.hash(password,12).then(hashedpassword=>{
    let sql = `UPDATE users
    SET password = ?
    WHERE email = ?`;

    let data = [hashedpassword, email];
    connection.execute(sql, data, 
        (error, results, fields) => {    
    
    });
    res.send("Password updated Succefully")

}) 
});
module.exports = router;