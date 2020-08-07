const express = require ('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user');

// get a list of user from the db
router.get('/login', function(req, res){
    res.send({type: 'GET'});
});

// add a new user to the db
router.post('/login', function(req, res,next){
    console.log(req.body);
    User.create(req.body).then(function(user){
        res.send(user);
    }).catch(next);
});

// update a user in the db
router.put('/user/:id', function(req, res, next){
    Ninja.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        Ninja.findOne({_id: req.params.id}).then(function(user){
            res.send(user);
        });
    }).catch(next);
});
// delete a user from the db
router.delete('/user/:id', function(req, res, next){
    Ninja.findByIdAndRemove({_id: req.params.id}).then(function(user){
        res.send(user);
    }).catch(next);
});

// Register
router.post('/register', function(req, res,next){
    const { firstName,lastName, email, password, password2 } = req.body;
    let errors = [];
  
    if (!firstName || !lastName || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
        console.log(errors);
      res.send(
        errors,
        firstName,
        lastName,
        email,
        password,
        password2
      );
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Account with this email already exists' });
          res.render('/register', {
            errors,
            firstName,
            lastName,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
        }
    
    });
}});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/api/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/api/login');
  });
  

module.exports = router;