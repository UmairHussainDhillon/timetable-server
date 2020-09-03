const dbConnection = require("../Databases/connect");
var express = require("express");
var bodyparser = require("body-parser");
var router = express.Router();



router.post("/addclash",async(req,res)=>{
    var course_id = req.body.course_id;
    var clash_course_id = req.body.clash_course_id;
    //check if already exixts or not
  let check=false;
  await  dbConnection
    .execute("SELECT * FROM `clashes` ")
    .then(([rows]) => {
       for(let i=0; i<rows.length; i++) {                
            if(rows[i].course_id==course_id &&rows[i].clash_course_id==clash_course_id ){
                check=true;
                break;
            }
            
            else{
                check=false;
            }
        }
    });

if(check==true){
    res.send("Clash already exists in table");
    }
    else{
         dbConnection.query("INSERT INTO `clashes`(`course_id`, `clash_course_id`) VALUES(?,?)",
    [course_id, clash_course_id])
    .then((result) => {
        res.status(200).send(`Clash Noted...`);
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