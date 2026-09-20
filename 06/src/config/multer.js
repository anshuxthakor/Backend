const multer = require("multer");

// DiskStorage
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log("In filename —> ", file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// MemoryStorage
const memoryStorage = multer.memoryStorage();

const diskUpload = multer({ storage: diskStorage });
const memoryUpload = multer({ storage: memoryStorage });

module.exports = {
  diskUpload,
  memoryUpload,
};
