var connection = require('./connect');
var express = require('express');

var router = express.Router();

router.get('/',(req,res)=>{
    connection.query('select * from users',(err,array,feilds)=>{
        if (err) throw error
        else
        res.send(array);
    });
});
module.exports = router;