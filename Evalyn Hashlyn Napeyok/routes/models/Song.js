// models/Song.js
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
coverPath: { 
    type: String, 
    required: true 
},
title: { 
    type: String, 
    required: true, 
    trim: true 
},
artist: { 
    type: String, 
    required: true, 
    trim: true 
},
album: { 
    type: String, 
    trim: true 
},
year: { 
    type: Number 
},
 
audioPath: { 
    type: String, 
    required: true 
}
}, 
{ timestamps: true });

module.exports = mongoose.model('Song', songSchema);
