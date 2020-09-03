var connection = require('../../Databases/connect');
var express = require('express');

var router = express.Router();

router.post('/getcourses',(req,res)=>{
    console.log(req.body)
    semester=req.body.semester
    connection.execute('SELECT * FROM `courses` WHERE `semester`=?', [semester])
    .then(([rows]) => {
        if(rows.length === 0){
          console.log(rows.length)
         //   return Promise.reject('This E-mail already in use!');
         res.send(`error occured! `);
        }
       else{ res.send(rows);}

    }).catch(err => {
        // THROW INSERTING USER ERROR'S
        if (err) throw err;
    });
  

    // 
    
 /*
    connection.query("select * from courses where semester="+semester,(err,array,feilds)=>{
        if (err) throw err
        else
        res.send(array);
    });*/
});
module.exports = router;
