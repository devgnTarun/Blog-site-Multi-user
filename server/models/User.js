const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name can not be empty'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email can not be empty'],
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Minimum Length of password should be 8 characters!'],
        trim: true
    }
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema);