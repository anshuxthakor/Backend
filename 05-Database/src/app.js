// Server ko create karna and config karna
const express = require('express');
const noteModel = require('../src/models/notes.model');
const app = express();

app.use(express.json());

app.post('/notes', async (req, res) => {
    const { title, description } = req.body;
    const note = await noteModel.create({ title, description });
    res.status(201).json({
        message: 'Note created successfully',
        note: note
    });
});

app.get('/notes', async(req, res) => {
    const notes = await noteModel.find();
    res.status(200).json({
        message: 'Notes retrieved successfully',
        notes: notes
    });
});

app.delete('/notes/:id', async (req, res) => {
    const note = await noteModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
        message: 'Note deleted successfully',
        note: note
    });
});

app.patch('/notes/:id', async (req, res) => {
    const note = await noteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
        message: 'Description updated successfully',
        note: note
    });
});


module.exports = app;