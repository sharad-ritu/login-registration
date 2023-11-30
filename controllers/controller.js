const User = require('../models/users');
const asyncWrapper = require('../middleware/async');
const bcrypt = require('bcrypt');

const loginForm = asyncWrapper(async (req, res, next) => {
    res.status(200).render('login');
});

const loginProcess = asyncWrapper(async (req, res, next) => {
    const maxLoginAttempts = 5;
    const resetDelayInMilliseconds = 15 * 60 * 1000;

    if (req.session.loginAttempts >= maxLoginAttempts) {
        const lastLoginAttemptTime = req.session.lastLoginAttemptTime || 0;
        const currentTime = Date.now();

        if (currentTime - lastLoginAttemptTime < resetDelayInMilliseconds) {
            const timeUntilReset = resetDelayInMilliseconds - (currentTime - lastLoginAttemptTime);
            const minutes = Math.ceil(timeUntilReset / (60 * 1000));

            return res.status(401).render('login', {
                login_limit: `Too many unsuccessful login attempts. Please try again in ${minutes} minutes.`,
            });
        }

        // Reset login attempts
        req.session.loginAttempts = 0;
    }

    let { username, password } = req.body;
    username = username.replace(/[^\w\s]/gi, '');

    const user = await User.findOne({ username });

    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.loginAttempts = 0;
            return res.status(200).render('home', { username });
        }
    }

    // Password doesn't match or user not found
    req.session.loginAttempts = (req.session.loginAttempts || 0) + 1;
    req.session.lastLoginAttemptTime = Date.now(); // Update the last login attempt time

    const remainingAttempts = maxLoginAttempts - req.session.loginAttempts;

    const error = new Error('Invalid credentials');
    error.remainingAttempts = remainingAttempts;
    
    if (user) {
        // User found, but password is incorrect
        error.id = 'INVALID_PASSWORD';
    } else {
        // User not found
        error.id = 'USER_NOT_FOUND';
    }

    next(error);
});

const registerForm = asyncWrapper(async (req, res, next) => {
    res.status(200).render('register');
});

const registerProcess = asyncWrapper(async (req, res, next) => {
    const { username, password, email, age} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({username, password: hashedPassword, email, age});
    res.status(200).render('login');
});

module.exports = {loginForm, loginProcess, registerForm, registerProcess};