const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: [20, "Description must be at least 20 characters long"],
  },
});

const NotesModel = mongoose.model("notes", notesSchema);
module.exports = NotesModel;