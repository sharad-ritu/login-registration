const express = require('express');
const router = express.Router();

const {loginForm} = require('../controllers/controller');

router.route('/').get(loginForm);
//router.route('/register').get(registerForm).post(registerProcess);

module.exports = router;