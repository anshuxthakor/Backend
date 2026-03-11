const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/home', (req, res) => {
    res.send('Welcome to the home page!');
});

app.get('/about', (req, res) => {
    res.send('This is the about page.');
});

module.exports = app;