const express = require('express');
const authRouter = express.Router();

// const {check} = require('express-validator');

const {signup, login, logout, resetPassword, newPassword} = require('../controllers/auth.controller');

authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.post('/logout', logout);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/new-password/:token', newPassword);

module.exports = authRouter;
