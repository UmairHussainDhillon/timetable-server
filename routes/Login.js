const dbConnection = require("../Databases/connect");
const { body, validationResult } = require("express-validator");

const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var bodyparser = require("body-parser");

var bodyparser = require("body-parser");
const { Router } = require("express");
var router = express.Router();

process.env.SECRET_KEY = "secret";

//
// LOGIN PAGE
let result = {};
let status = 200;

router.post("/login", (req, res) => {
    const { password, email } = req.body;
console.log(req.body);
      dbConnection.execute("SELECT * FROM `users` WHERE `email`=?", [email])
        .then(([rows]) => {
            if(rows.length ===0){
              console.log('Email not found')
              result.status=404;
              result.msg="User Does Not Exists with this Email";
              res.send(result);

            //  res.status(404).send("")
            }
            
          else{

          bcrypt
            .compare(password, rows[0].password)
            .then((compare_result) => {
              if (compare_result === true) {
                //  let token = jwt.sign(req.body.dataValues, process.env.SECRET_KEY, {
                //     expiresIn: 1440
                //    })
                //    res.send(token)
                result.status = 200;
                // Create a token
                const payload = { user: email };
                const options = {
                  expiresIn: "2d",
                };
                const secret = process.env.SECRET_KEY;
                const token = jwt.sign(payload, secret, options);

              
                result.token = token;
                result.msg="Login Successfull";
                result.status = status;
                result.user = {
                    first_name: rows[0].first_name,
                    last_name: rows[0].last_name,
                    institute: rows[0].institute,
                    email: rows[0].email,
                    contact: rows[0].contact,
                  };
              
              } else {
                result.status = 401;
                result.msg = `Invalid Password `;
              }
              res.send(result);
            })
            .catch((err) => {
              if (err) throw err;
            });
        
    }

  } );
});

module.exports = router;
