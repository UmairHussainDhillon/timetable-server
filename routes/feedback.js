const dbConnection = require("../Databases/connect");

const express = require("express");
const path = require("path");

const { Router } = require("express");
var router = express.Router();
var bodyparser = require("body-parser");


//
// Feedback PAGE
let result = {};
let status = 200;

router.post("/feedback", (req, res) => {
    console.log(req.body);
    const { name, email,message,contact } = req.body;
    dbConnection.execute("INSERT INTO `feedback`(`name`,`contact`, `email`,`message`) VALUES(?,?,?,?)",
    [name,contact, email,message])
   .then(result => {
  console.log("Feedback noted");
  status=200;
   result="feedback submitted Successfully... ";
  res.send(result);

}).catch(err => {
    // THROW INSERTING USER ERROR'S
    if (err) throw err;
});
});
router.get("/feedback", (req, res) => {
    dbConnection.query("select * from feedback", (err, array, feilds) => {
      res.send(array);
      console.log("Response fron feedback Sent...");
    });
  });
module.exports = router;
