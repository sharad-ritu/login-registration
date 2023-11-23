const express = require('express');
const router = express.Router();

const {loginForm, registerProcess} = require('../controllers/controller');

router.route('/').get(loginForm);
router.route('/register').post(registerProcess);

module.exports = router;