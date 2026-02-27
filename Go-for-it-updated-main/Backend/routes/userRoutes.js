const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

router.route('/register').post(asyncHandler(registerUser));
router.route('/login').post(asyncHandler(authUser));

module.exports = router;