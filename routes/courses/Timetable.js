const dbConnection = require("../../Databases/connect");
var express = require("express");
const path = require("path");

var bodyparser = require("body-parser");
const { Router } = require("express");
var router = express.Router();

router.post("/timetable", (req, res) => {
  console.log(req.body);

  var instructor_id;
  var semester;
  var course_name;


 // var classroom_id;

    Course_id = req.body.Course_id;
  (day_id = req.body.day_id),
    (slot_id = req.body.slot_id),
    (slot = req.body.slot_id);
   classroom_id = 1;
  //  course_id = req.body.course_id;
  let errors = [];
  let Results = {};
  var StrongConstraint = false;
  var WeakConstraint = false;

  var timetable = [];
  //To get assisgned teacher of Course
  dbConnection
    .execute("SELECT * FROM `courses` WHERE `course_id`=?", [Course_id])
    .then(([rows]) => {
      console.log(rows.length);
      if (rows[0].instructor_id == null) {
        console.log("No Instructor");
        errors.push("Please Assign a Instructor First");
      }
      instructor_id = rows[0].instructor_id;

      semester = rows[0].semester;
      course_name = rows[0].course_name;

      console.log(semester);

    });


  dbConnection
    .execute("SELECT * FROM `timetable` ")
    .then(([rows]) => {
      timetable = rows;

      //Constraints  Bussiness Logic

      // Friday Prayer Time
      if (day_id == 5 && slot_id == 3) {
        errors.push("Friday Prayer Time");
        StrongConstraint = true;
      }
      // for same Instructor
      for (let i = 0; i < timetable.length; i++) {
        if (
          timetable[i].instructor_id == instructor_id &&
          timetable[i].slot_id == slot_id &&
          timetable[i].day_id == day_id
        ) {
          errors.push("Instructor Can't teach two Classes at Same Time");
          StrongConstraint = true;
          //     console.log(timetable[i].timetable_id);
          //  status= false;
          break;
        }
      }
      // for same Course at same Time
      for (let i = 0; i < timetable.length; i++) {
        if (
          timetable[i].course_id == Course_id &&
          timetable[i].slot_id == slot_id &&
          timetable[i].day_id == day_id
        ) {
          errors.push("Two Classes of Same Course cant be at same time");
          StrongConstraint = true;

          //     console.log(timetable[i].timetable_id);
          //  status= false;
          break;
        }
      }
      // for  Classroom ID
      for (let i = 0; i < timetable.length; i++) {
        console.log(classroom_id)
       if(classroom_id === 5) {
       // No Classroom is Free
         errors.push("No Classroom is Free");
         WeakConstraint=true;
         break;
       }
       else{if ( timetable[i].day_id == day_id) {
        // To go to Particular Day in Table:
          if(timetable[i].slot_id==slot_id){
         // For Particular Slot in Table: ")
           if(timetable[i].classroom_id===classroom_id)
           //If First Classroom is Not free Check Next One)
            classroom_id++;
          }
        }
      }}

      //Weak Constraints
//Instructors Forbidden Time Zone


    })
    .then((user) => {
      // INSERTING Table Row INTO DATABASE
      console.log("Errors Length: "+errors.length)
      if (errors.length == 0) {
        console.log(Course_id,instructor_id,slot_id,day_id,classroom_id)
        dbConnection
          .execute(
            "INSERT INTO `timetable`(`course_id`, `instructor_id`, `slot_id`,`day_id`,`classroom_id`, `semester`,`course_name`) VALUES(?,?,?,?,?,?,?)",
            [Course_id, instructor_id, slot_id, day_id, classroom_id,semester,course_name]
          )
          .then((result) => {
            console.log("done");
            res.status(200).send(`Added in Table Successfully`);
          })
          .catch((err) => {
            // THROW INSERTING  ERROR'S
            if (err) {
              res.send(err);
            } 
          });
      } else {
        Results.errors = errors;
        Results.StrongConstraint = StrongConstraint;
        Results.WeakConstraint = WeakConstraint;
        console.log(Results);
        res.send(Results);
      }
    });
});


//Get Request to View Timetable
router.get('/viewtimetable', function (req, res) {
  var data="Hello World";
  dbConnection
  .execute("SELECT * FROM `timetable` ")
  .then(([rows]) => {
    if(rows.length===0){
      data="No Record Found! Please Create Timetable First"
      res.send(data)
    }
    else{
      data = rows;
      console.log("Data Send: ")
      res.send(data)
    }
}) .catch((err) => {
  // THROW INSERTING  ERROR'S
  if (err) {
    res.send(err);
  }
});
});


module.exports = router;
