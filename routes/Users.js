const dbConnection = require('../Databases/connect');
var express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
var router = express.Router();


var bodyparser = require('body-parser');
const { Router } = require('express');

const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

// Create Transport
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))

router.post('/register', (req, res) => {
  console.log(req.body);
  const created = new Date()
var result;
  const { first_name, last_name, email,institute,contact, password } = req.body;

    dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [email])
    .then(([rows]) => {
        if(rows.length > 0){
          console.log(rows.length)
          result="This Email is Already in Use";
         res.send(result);
        }
       else{
    //TODO bcrypt
           bcrypt.hash(password, 12).then((hash_pass) => {
        // INSERTING USER INTO DATABASE
           dbConnection.execute("INSERT INTO `users`(`first_name`,`last_name`, `email`,`institute`, `contact`,`password`,`created`) VALUES(?,?,?,?,?,?,?)",
            [first_name,last_name, email,institute, contact,hash_pass,created])
           .then(result => {
          console.log("done");
          result="your account has been created successfully... ";

          res.send(result);
         /* transporter.sendMail({
               to:email,
              from:"umairdhillun.uh@gmail.com",
               subject:`Welcome To Timetable Management System`,
                 html:`<h1>Hi ${first_name} </h1>
                 <p>You have Successfully Signed Up in Timetable Management System Now you can create Timetable</p>`
             })*/
       
        }).catch(err => {
            // THROW INSERTING USER ERROR'S
            if (err) throw err;
        });
    })
    
    }})
});
// END OF REGISTER ROUTE

var i=0;

router.post('/profile', (req, res) => {
  var email = req.body.email;
  console.log(i+email)

dbConnection.execute('SELECT * FROM `users` WHERE `email`=?', [email])
    .then(([rows]) => {
      console.log(rows)

      res.status(200).send(rows);
    }
);
      })
router.post('/deleteProfile', (req, res) => {
        var email = req.body.email;
        console.log(i+email)
        dbConnection.execute('DELETE FROM `users` WHERE `email`=?', [email])
        .then(([rows]) => {
          res.status(200).send("Account Deleted Successfully");
        }).catch(err => {
          // THROW INSERTING USER ERROR'S
          res.send("Delete failed!");
          if (err) throw err;
      });
    /*  
      dbConnection.query("DELETE FROM  users where email="+email,
      (err,result)=>{
if(err){
}else{
}
});*/
            })
module.exports = router;