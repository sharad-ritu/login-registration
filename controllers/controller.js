const User = require('../models/users');
const asyncWrapper = require('../middleware/async');
const bcrypt = require('bcrypt');

const loginForm = asyncWrapper(async (req, res, next) => {
    res.status(200).render('login', {title: 'Login Page'});
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
            req.session.authenticated = true;
            req.session.user_name = user.username;
            return res.status(200).render('home', { layout: false, username });
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
    res.status(200).render('register', {title: 'Register Page'});
});

const registerProcess = asyncWrapper(async (req, res, next) => {
    const { username, password, email, age} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({username, password: hashedPassword, email, age});
    res.status(200).render('login');
});

const logoutProcess = asyncWrapper(async (req, res, next) => {
        req.session.destroy();
        if (!req.session) {
            res.render('login');
        } else {
            // Handle the case where the session is not properly destroyed
            res.status(500).send('Failed to destroy session');
        }
});

const homePage = asyncWrapper(async (req, res, next) => {
    res.status(200).render('home', { layout: false, username: req.session.user_name});
});

const profilePage = asyncWrapper(async (req, res, next) => {
    const {username} = req.params;
    const user = await User.findOne({ username });
    const { email, age} = user;
    res.status(200).render('profile', { layout: false, username, email, age});

});

const changePasswordForm = asyncWrapper(async (req, res, next) => {
    res.status(200).render('change_pass', { layout: false, username: req.session.user_name});
});

const changePasswordProcess = asyncWrapper(async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;
    const {username} = req.params;

    const user = await User.findOne({ username });
    if (user) {
        const matchOldPassword = await bcrypt.compare(oldPassword, user.password);
        if (matchOldPassword) {
            if (oldPassword === newPassword){
                return res.status(400).render('change_pass', { layout: false, newPassError: 'New Password cannot be same as Old Password.', username});
            }
            else {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const up_user = await User.findOneAndUpdate(
                    { username: username},
                    {$set: { password: hashedPassword}},
                    {new: true, runValidators: true}
                );

                if (!up_user) {
                    next('Something went wrong!');
                }
                return res.redirect('/logout');
            }
        }
        else {
            return res.status(400).render('change_pass', { layout: false, oldPassError: 'Please enter correct password.', username});
        }
    }
    else {
        next('Cannot Find the user');
    }
});

const editForm = asyncWrapper(async (req, res, next) => {
    const {username} = req.params;
    const user = await User.findOne({ username });
    const { email, age} = user;
    res.status(200).render('edit', { layout: false, username: req.session.user_name, email, age});
});

const editProcess = asyncWrapper(async (req, res, next) => {
    const { username } = req.params;
    if ( username != req.session.user_name) {
        return res.status(400).json({ error: 'Error! Please try again.'});
    }
    const { user, email, age } = req.body;

    if ( user === '' || email === '' || age === '' ) {
        return res.status(400).json({ error: 'Error! Please input values.' });
    }

    const up_user = await User.findOneAndUpdate(
        { username: username},
        {$set: { username: user , email: email, age: age }},
        {new: true, runValidators: true}
    );
    res.status(200).json({ message: 'Edit successful' });
});

const deleteProcess = asyncWrapper(async (req, res, next) => {
    const { username : user } = req.params;
    const dl_user = await User.findOneAndDelete({ username: user });
    if (!dl_user) {
        return res.status(400).json({ error: 'User not found' });
    }
    res.status(200).render('register');
});

module.exports = {
    loginForm, 
    loginProcess, 
    registerForm, 
    registerProcess, 
    logoutProcess,
    homePage,
    profilePage,
    changePasswordForm,
    changePasswordProcess,
    editForm,
    editProcess,
    deleteProcess
};