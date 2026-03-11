const express = require('express');
const app = express();

app.use(express.json());

app.post('/notes', (req, res) => {
    console.log(req.body);
    notes.push(req.body);
    res.status(201).json({ message: 'Note created successfully' });
});

app.get('/notes', (req, res) => {
    res.json(notes);
});

module.exports = app;