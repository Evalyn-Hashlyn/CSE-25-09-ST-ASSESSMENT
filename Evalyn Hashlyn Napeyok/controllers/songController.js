const Song = require("../models/Song");

exports.createSong = async (req, res) => {
  try {
    const { title, artist, album, year } = req.body;
    const audioFile = req.files.audio?.[0];
    const coverFile = req.files.cover?.[0];

    if (!title || !artist || !audioFile || !coverFile) {
      return res.json({ success: false, message: "Title, artist, audio, and cover are required." });
    }

    const newSong = await Song.create({
      title,
      artist,
      album: album || "",
      year: year || null,
      audioPath: "/audio/" + audioFile.filename,
      coverPath: "/images/uploads/" + coverFile.filename
    });

    res.json({ success: true, message: "Song uploaded successfully!", song: newSong });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error." });
  }
};

exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};
