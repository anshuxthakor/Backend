const express = require("express");
const cors = require("cors");
const notesRouter = require("./routes/notes.route");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello, From Express!");
});

app.use("/api", notesRouter);

module.exports = app;
