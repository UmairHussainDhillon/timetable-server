const dbConnection = require("../Databases/connect");
var express = require("express");
var bodyparser = require("body-parser");
var router = express.Router();



router.post("/addpreference",async(req,res)=>{
    var day_id = req.body.day_id;
    var slot_id = req.body.slot_id;
    var instructor_id = req.body.instructor_id;
    console.log(req.body)
    //check if already exixts or not
  let check=false;
  await  dbConnection
    .execute("SELECT * FROM `preference` ")
    .then(([rows]) => {
       for(let i=0; i<rows.length; i++) {                
            if(rows[i].day_id==day_id &&rows[i].instructor_id==instructor_id && rows[i].slot_id==slot_id){
                check=true;
                break;
            }
            else{
                check=false;
            }
        }
    });

if(check==true){
    res.send("Preference already exists in table");
    }
    else{
         dbConnection.query("INSERT INTO `preference`(`day_id`, `slot_id`, `instructor_id`) VALUES(?,?,?)",
    [day_id, slot_id, instructor_id])
    .then((result) => {
        res.status(200).send(`Preference Noted...`);
      })
      .catch((err) => {
        // THROW INSERTING  ERROR'S
        if (err) {
          res.send(err);
        } 
      });

    }
});
module.exports = router;