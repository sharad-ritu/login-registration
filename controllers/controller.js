const User = require('../models/users');
const asyncWrapper = require('../middleware/async');

const loginForm = asyncWrapper(async (req, res, next) => {
    res.status(200).render('login');
});

const loginProcess = asyncWrapper(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username});
    if (user && user.password === password) {
        // User found and password matches
        res.status(200).json({ msg: 'Login successful' });
    } else {
        // User not found or password does not match
        res.status(404).json({ msg: 'Invalid username or password' });
    }
});

const registerForm = asyncWrapper(async (req, res, next) => {
    res.status(200).render('register');
});

const registerProcess = asyncWrapper(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(200).json({user});
});

module.exports = {loginForm, loginProcess, registerForm, registerProcess};