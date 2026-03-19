const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/getme', authController.getMe);

module.exports = authRouter;