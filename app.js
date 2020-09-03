const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
//----------------------------------------- END OF IMPORTS---------------------------------------------------

//DB CONNECTION

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./models/passportConfig")(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------



// Routes

var userRouter = require('./routes/Users');
app.use('/users',userRouter);

//
var fetch = require('./Databases/fetch')
app.use('/', fetch);

//
var Update = require('./Databases/update')
app.use('/', Update);

//
var GetCourses = require('./routes/courses/getcourses')
app.use('/', GetCourses);


//


//
var AddInstructor = require('./routes/AddInstructor')
app.use('/', AddInstructor);

//
var TimetableRouter = require('./routes/courses/Timetable')
app.use('/', TimetableRouter);
//
var RegisterRouter = require('./routes/Users')
app.use('/', RegisterRouter);
//
var LoginRouter = require('./routes/Login')
app.use('/users', LoginRouter);

//
var ResetRouter = require('./routes/auth')
app.use('/', ResetRouter);

//
var PreferenceRouter = require('./routes/AddPreference')
app.use('/', PreferenceRouter);

//
var ClashRouter = require('./routes/AddClashes')
app.use('/', ClashRouter);
//

app.get("/user", (req, res) => {
  res.send("its Working !"); // To check Route
});
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
PORT= process.env.PORT||5000;
app.listen(PORT, () => {
  console.log("Server Has Started on PORT: "+ PORT);
});