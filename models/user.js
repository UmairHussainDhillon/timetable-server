/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create User Schema & model
const UserSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email field is required']
    },
    active: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'password field is required']
    }
    // add in geo location
});

const User = mongoose.model('User', UserSchema);

module.exports = User;*/
const mongoose = require("mongoose");
const user = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email field is required']
    },
    active: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, 'password field is required']
    }
});

module.exports = mongoose.model("User", user);