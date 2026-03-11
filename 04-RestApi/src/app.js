const express = require('express');
const app = express();

app.use(express.json());

const notes = [];

app.post('/notes', (req, res) => {
    notes.push(req.body);
    res.status(201).json({
        message: 'Note created successfully',
        notes: notes
    });
});

app.get('/notes', (req, res) => {
    res.status(200).json({
        message: 'Notes retrieved successfully',
        notes: notes
    });
});

app.delete('/notes/:index', (req, res) => {
    delete notes[req.params.index];
    res.status(200).json({
        message: 'Note deleted successfully',
        notes: notes
    });
});

app.patch('/notes/:index', (req, res) => {
    notes[req.params.index].description = req.body.description;
    res.status(200).json({
        message: 'Notes description updated successfully',
        notes: notes
    });
});

module.exports = app;