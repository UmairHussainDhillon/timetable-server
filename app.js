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
app.use('/fetch', fetch);

//
var Update = require('./Databases/update')
app.use('/', Update);

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

app.get("/user", (req, res) => {
  res.send("its Working !"); // The req.user stores the entire user that has been authenticated inside of it.
});
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
PORT= process.env.PORT||5000;
app.listen(PORT, () => {
  console.log("Server Has Started on PORT: "+ PORT);
});