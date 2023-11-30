const express = require('express');
const router = express.Router();

const {loginForm, loginProcess, registerForm, registerProcess} = require('../controllers/controller');
const { limiter } = require('../middleware/rate-limit');

router.route('/').get(loginForm).post(loginProcess);
router.route('/register').get(registerForm).post(registerProcess);

module.exports = router;