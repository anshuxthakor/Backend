const NotesModel = require("../models/notes.model");

const createNotesController = async (req, res) => {
  try {
    let { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }
    let newNote = await NotesModel.create({ title, description });
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getAllNotesController = async (req, res) => {
  try {
    const notes = await NotesModel.find();
    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getSingleNoteController = async (req, res) => {
  try {
    let { id } = req.params;
    const note = await NotesModel.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json({
      success: true,
      message: "Note retrieved successfully",
      data: note,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

const updateNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }
    const updatedNote = await NotesModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const deleteNoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await NotesModel.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};


module.exports = {
  createNotesController,
  getAllNotesController,
  getSingleNoteController,
  updateNoteController,
  deleteNoteController,
};