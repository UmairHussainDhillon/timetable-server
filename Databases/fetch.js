var connection = require('./connect');
var express = require('express');

var router = express.Router();

router.post('/bs4',(req,res)=>{
    semester=req.body.semester
    connection.query("select * from courses where semester="+semester,(err,array,feilds)=>{
        if (err) throw err
        else
        res.send(array);
    });
});
module.exports = router;