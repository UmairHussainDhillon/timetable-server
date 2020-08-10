const dbConnection = require('../Databases/connect');
const { body, validationResult } = require('express-validator');

const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var bodyparser = require('body-parser');

var bodyparser = require('body-parser');
const { Router } = require('express');
var router = express.Router();


process.env.SECRET_KEY = 'secret';

//
// LOGIN PAGE
router.post('/login', [
    body('email').custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            console.log(rows.length)
            if(rows.length >0 ){
                return true;
                
            }
            return Promise.reject('Invalid Email Address!');
         // return(`Invalid E-mail Address! `);
            
        });
    }),
    body('password','Password is empty!').trim().not().isEmpty(),
    body('email','email is empty!').trim().not().isEmpty(),

], (req, res) => {
    console.log(req.body);
    const validation_result = validationResult(req);
    const {password, email} = req.body;
    if(validation_result.isEmpty()){
        
        dbConnection.execute("SELECT * FROM `users` WHERE `email`=?",[email])
        .then(([rows]) => {
            bcrypt.compare(password, rows[0].password).then(compare_result => {
                    if(compare_result === true){
                  //  let token = jwt.sign(req.body.dataValues, process.env.SECRET_KEY, {
                   //     expiresIn: 1440
                  //    })
                  //    res.send(token)
                    res.send('You are Logged in');
              //   res.redirect('/dashboard');
                }
             else{
                    res.status(400).json({ error: 'Invalid Password!' })
                }
            })
            .catch(err => {
                if (err) throw err;

            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            res.send(error.msg) 
        });
        // REDERING login-register PAGE WITH LOGIN VALIDATION ERRORS
    }
});

module.exports = router;