var connection = require('./connect');
var express = require("express");
var router = express.Router();

router.post("/update",(req,res)=>{
    console.log(req.body)
    var user_id = req.body.user_id;
    var first_name = req.body.first_name;
    var contact = req.body.contact;
  //  var sql = "UPDATE users SET first_name = 'Canyon'  WHERE `user_id`='?', [id]";
  let sql = `UPDATE users
           SET first_name = ?
           WHERE user_id = ?`;

let data = [first_name, user_id];

// execute the UPDATE statement
connection.query(sql, data, (error, results, fields) => {
  if (error){
    return console.error(error.message);
  }
  else{
  console.log('Rows affected:', results.affectedRows);
  res.send(results)}
});

   
});

module.exports = router;


