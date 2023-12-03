const express = require('express');
const router = express.Router();

const {
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
    editProcess
} = require('../controllers/controller');

const { isAuthenticated } = require('../middleware/rate-limit');

router.route('/').get(isAuthenticated, homePage).post(loginProcess);
router.route('/register').get(registerForm).post(registerProcess);
router.route('/logout').get(isAuthenticated, logoutProcess);
router.route('/profile/:username').get(isAuthenticated, profilePage);
router.route('/changePassword/:username').get(isAuthenticated, changePasswordForm).post(changePasswordProcess);
router.route('/edit/:username').get(isAuthenticated, editForm).patch(editProcess);


module.exports = router;