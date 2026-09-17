const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: [10, "Description must be at least 10 characters long"],
  },
});

const NotesModel = mongoose.model("notes", notesSchema);
module.exports = NotesModel;