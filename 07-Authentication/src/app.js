const express = require('express');
const authRouter = require('./routes/auth.route');
const cookiesParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookiesParser());

app.use('/api/auth', authRouter);

module.exports = app;