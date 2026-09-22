const userRouter = require('express').Router();

const { createController } = require('../controllers/user.controller');
const upload = require('../config/multer.config');

userRouter.post('/upload', upload.single('profile'), createController)

module.exports = userRouter;