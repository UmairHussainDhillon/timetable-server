const dbConnection = require("../../Databases/connect");
var express = require("express");
const path = require("path");

var bodyparser = require("body-parser");
const { Router } = require("express");
var router = express.Router();

router.post("/timetable", (req, res) => {
  // console.log(req.body);

  (instructor_id = req.body.instructor_id),
    (instructor = req.body.instructor_id),
    (day_id = req.body.day_id),
    (slot_id = req.body.slot_id),
    (slot = req.body.slot_id),
    (classroom_id = req.body.classroom_id),
    (course_id = req.body.course_id);

  let errors = [];
  var timetable = [];

  dbConnection
    .execute("SELECT * FROM `timetable` ")
    .then(([rows]) => {
      timetable = rows;

      console.log(timetable.length);
              //Constraints  Bussiness Logic

      // Friday Prayer Time
      if(day_id == 5 && slot_id ==3){
        errors.push("Friday Prayer Time");
      }
      // for same Instructor
      for (let i = 0; i < timetable.length; i++) {
        if (
          timetable[i].instructor_id == instructor_id &&
          timetable[i].slot_id == slot_id &&
          timetable[i].day_id == day_id
        ) {
          errors.push("Instructor Can't teach two Classes at Same Time");
          //     console.log(timetable[i].timetable_id);
          //  status= false;
          break;
        }
      }
      // for same Course at same Time
      for (let i = 0; i < timetable.length; i++) {
        if (
          timetable[i].course_id == course_id &&
          timetable[i].slot_id == slot_id &&
          timetable[i].day_id == day_id
        ) {
          errors.push("Two Classes of Same Course cant be at same time");
          //     console.log(timetable[i].timetable_id);
          //  status= false;
          break;
        }
      }
      // for same Classroom at same Time
      for (let i = 0; i < timetable.length; i++) {
        if (
          timetable[i].classroom_id == classroom_id &&
          timetable[i].slot_id == slot_id &&
          timetable[i].day_id == day_id
        ) {
          errors.push("Classroom Can't be used for Two Classes at Same Time");
          break;
        }
      }
      //
    })
    .then((user) => {
      // INSERTING USER INTO DATABASE
      if (errors.length == 0) {
        // console.log(handleconstraint())
        dbConnection
          .execute(
            "INSERT INTO `timetable`(`course_id`, `instructor_id`, `slot_id`,`day_id`,`classroom_id`) VALUES(?,?,?,?,?)",
            [course_id, instructor_id, slot_id, day_id, classroom_id]
          )
          .then((result) => {
            console.log("done");
            res.status(200).send(`Added in Table Successfully`);
          })
          .catch((err) => {
            // THROW INSERTING USER ERROR'S
            if (err) {
              res.send(err);
            }
          });
      } else {

        res.status(400).send(errors);
      }
    });
});

module.exports = router;
