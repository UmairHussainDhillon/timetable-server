/*
require('dotenv').config;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
  connection.connect(err => {
      let message = !err ?'connected' :console.log(err);
      console.log(`mysql : ${message}`)
  });
  module.exports = connection;*/


  const mysql = require('mysql2');
  const dbConnection = mysql.createPool({
      host     : 'localhost', // MYSQL HOST NAME
      user     : 'test', // MYSQL USERNAME
      password : 'timetable', // MYSQL PASSWORD
      database : 'timetable_mis' // MYSQL DB NAME
  }).promise();
  module.exports = dbConnection;