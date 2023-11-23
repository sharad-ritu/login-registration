const User = require('../models/users');
const asyncWrapper = require('../middleware/async');

const loginForm = asyncWrapper(async (req, res, next) => {
    res.status(200).render('login');
});

const registerProcess = asyncWrapper(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(200).json({user});
})  

module.exports = {loginForm, registerProcess};