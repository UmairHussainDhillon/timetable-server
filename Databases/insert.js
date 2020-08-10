var con = require("../db_connection");
var connection = con.getConnection();
connection.connect();
var express = require("express");
var router = express.Router();
router.post("/",(req,res)=>{
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var institute = req.body.institute;
    connection.query("insert into users values("+first_name+",'"+last_name+"',"+email+",'"+institute+"')",
                    (err,result)=>{
        if(err){
            res.send({"insert":"fail"});
        }else{
            res.send({"insert":"success"});
        }
    }); 
});
module.exports = router;