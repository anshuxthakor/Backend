const express = require("express");
const {
  createNotesController,
  getAllNotesController,
  getSingleNoteController,
  updateNoteController,
  deleteNoteController,
} = require("../controllers/notes.controller");

const notesRouter = express.Router();

notesRouter.post("/create", createNotesController);
notesRouter.get("/notes", getAllNotesController);
notesRouter.get("/notes/:id", getSingleNoteController);
notesRouter.put("/update/:id", updateNoteController);
notesRouter.delete("/delete/:id", deleteNoteController);

module.exports = notesRouter;
