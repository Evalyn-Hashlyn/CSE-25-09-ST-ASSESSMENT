const express = require("express");
const router = express.Router();
const multer = require("multer");
const songController = require("../controllers/songController");
const path = require("path");
const fs = require("fs");

// Ensure upload folders exist
["public/audio", "public/images/uploads"].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") cb(null, "public/audio");
    else cb(null, "public/images/uploads");
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// POST upload
router.post("/", upload.fields([{ name: "audio", maxCount: 1 }, { name: "cover", maxCount: 1 }]), songController.createSong);

// GET all songs
router.get("/", songController.getSongs);

module.exports = router;
