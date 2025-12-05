const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create folder automatically if missing
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;

    if (file.fieldname === "audio") {
      folder = path.join(__dirname, "../public/audio");
    } else if (file.fieldname === "cover") {
      folder = path.join(__dirname, "../public/images/uploads");
    }

    ensureDir(folder); // Fixes ENOENT forever  

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});

// Accept two files: audio + cover
module.exports = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB
  }
});
