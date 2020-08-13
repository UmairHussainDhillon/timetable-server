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

/*
router.get('/',(req,res)=>{
    connection.query('select * from users',(err,array,feilds)=>{
        res.send(array);
    });
});
module.exports = router;*/
//
// FOR MYSQL DB
//FETCH
//import the fetch module
/*
var fetch = require('../Databases/fetch');
app.use('/fetch',fetch);

var insert = require('../Databases/insert');
app.use('/insert',insert);

var update = require('./update/update');
app.use('/update',update);

var remove = require('./delete/delete');
app.use('/delete',remove);
8*/



router.post('/register', (req, res) => {
  console.log(req.body);
  const created = new Date()
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    institute: req.body.institute,
    email: req.body.email,
    contact: req.body.contact,
    password: req.body.password,
  }
  const { first_name, last_name, email,institute,contact, password, password2 } = req.body;
  let errors = [];

    dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [email])
    .then(([rows]) => {
        if(rows.length > 0){
          console.log(rows.length)
         //   return Promise.reject('This E-mail already in use!');
         res.send(`This E-mail already in use! `);

        }
        return true;
    })
  
    //TODO bcrypt
    .then(user => {
      bcrypt.hash(password, 12).then((hash_pass) => {
        // INSERTING USER INTO DATABASE
        dbConnection.execute("INSERT INTO `users`(`first_name`,`last_name`, `email`,`institute`, `contact`,`password`,`created`) VALUES(?,?,?,?,?,?,?)",
        [first_name,last_name, email,institute, contact,hash_pass,created])
        .then(result => {
          console.log("done");
          res.send(`your account has been created successfully... `);
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
    
    })
});

    // COLLECT ALL THE VALIDATION ERRORS
  
    // REDERING login-register PAGE WITH VALIDATION ERRORS

// END OF REGISTER PAGE

/*
users.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          res.send(token)
        }
      } else {
        res.status(400).json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

users.get('/dashboard', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})*/

module.exports = router;