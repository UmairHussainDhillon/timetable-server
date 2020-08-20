const dbConnection = require("../Databases/connect");
var express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
var router = express.Router();

var bodyparser = require("body-parser");
const { Router } = require("express");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

router.post("/addinstructor", (req, res) => {
  console.log(req.body);
  const created = new Date();
  const userData = {
    instructor_name: req.body.instructor_name,
    email: req.body.email,
    contact: req.body.contact,
  };
  const { instructor_name, email, contact } = req.body;
  let errors = [];

  dbConnection
    .execute("SELECT `email` FROM `instructor` WHERE `email`=?", [email])
    .then(([rows]) => {
      if (rows.length > 0) {
        console.log(rows.length);
        //   return Promise.reject('This E-mail already in use!');
        res.send(`This E-mail already in use! `);
      }
      return true;
    })

    //
    .then((user) => {
      // INSERTING USER INTO DATABASE
      dbConnection
        .execute(
          "INSERT INTO `instructor`(`instructor_name`, `email`, `contact`,`created`) VALUES(?,?,?,?)",
          [instructor_name, email, contact, created]
        )
        .then((result) => {
          console.log("done");
          res.send(` New Teacher Added successfully... `);
        })
        .catch((err) => {
          // THROW INSERTING USER ERROR'S
          if (err) {
            res.send(err);
          }
        });
    });
});

router.get("/instructors", (req, res) => {
  dbConnection.query("select * from instructor", (err, array, feilds) => {
    res.send(array);
    console.log("Response fron instructors Sent...");
  });
});

// Assign Teacher to a Course Route

router.post("/assigncourseinstructor", (req, res) => {
  console.log(req.body);
  instructor_name = req.body.instructor_name;
  (course_code = req.body.course_code), (instructor_id = "");

  //Find Instructor ID by Instructor Name
  dbConnection
    .execute("SELECT * FROM `instructor` WHERE `instructor_name`=?", [
      instructor_name,
    ])
    .then(([rows]) => {
      console.log(rows);
      if (rows.length == 0) {
        return res.status(422).json({
          error:
            "Please Enter Correct Instructor Name || Add Instructor Details First",
        });
      } else {
        instructor_id = rows[0].instructor_id;
        console.log(instructor_id);

        //  Find Specific Course by Course Code
        dbConnection
          .execute("SELECT * FROM `courses` WHERE `course_code`=?", [
            course_code,
          ])
          .then(([rows]) => {
            console.log(rows);

            if (rows.length == 0) {
              //   return Promise.reject('This E-mail already in use!');
              return res
                .status(422)
                .json({ error: "Please Enter Correct Course Code" });
            }

            // execute the UPDATE statement
            let sql = `UPDATE courses
SET instructor_id = ?
WHERE course_code = ?`;

            let data = [instructor_id, course_code];
            dbConnection.query(sql, data, (error, results, fields) => {
                if (error) {
                  res.send(error.message);
                }
              
              })
            
                res.send("Added Successfully");
            

          });
      }
 
    });
});

module.exports = router;
