const express = require('express');
const router = express.Router();

const {
    loginForm, 
    loginProcess, 
    registerForm, 
    registerProcess,
    logoutProcess,
    homePage
} = require('../controllers/controller');

const { isAuthenticated } = require('../middleware/rate-limit');

router.route('/').get(isAuthenticated, homePage).post(loginProcess);
router.route('/register').get(registerForm).post(registerProcess);
router.route('/logout').get(isAuthenticated, logoutProcess);

module.exports = router;