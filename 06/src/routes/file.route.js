const express = require("express");
const { diskUpload, memoryUpload } = require("../config/multer");

const fileRouter = express.Router();

fileRouter.post("/disk", diskUpload.single("diskimage"), (req, res) => {
  try {
    let body = req.body;
    console.log(body);
    let file = req.file;
    console.log(file);
    res.status(200).json({
      message: "File uploaded successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

fileRouter.post("/memory", memoryUpload.single("memoryimage"), (req, res) => {
  try {
    let body = req.body;
    console.log(body);
    let file = req.file;
    console.log(file);
    res.status(200).json({
      message: "File uploaded successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = fileRouter;
