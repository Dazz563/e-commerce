const express = require('express');
const authRouter = express.Router();

const {signup, login, logout, resetPassword, newPassword} = require('../controllers/auth.controller');

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/new-password', newPassword);

module.exports = authRouter;
