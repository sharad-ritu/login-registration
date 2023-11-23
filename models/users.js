const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        unique: [true, 'email must be unique'],
        trim: true,
    },
    age: {
        type: Number,
    }
});

module.exports = mongoose.model('Users', userSchema);