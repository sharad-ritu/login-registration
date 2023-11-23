const User = require('../models/users');
const asyncWrapper = require('../middleware/async');

const loginForm = asyncWrapper(async (req, res) => {
    res.render('login');
})

module.exports = {loginForm};