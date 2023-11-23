const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username,
    password,
    email,
    age
});

module.exports = mongoose.model('User', userSchema);