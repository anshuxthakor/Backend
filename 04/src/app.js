const express = require("express");
const notesRouter = require("./routes/notes.route");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, From Express!");
});

app.use("/api", notesRouter);

module.exports = app;
