const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const songRoutes = require("./routes/songRoutes");

const app = express();
const port = 3000;

// DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => console.log("MongoDB connected")).on("error", err => console.error(err));

// View engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static files
app.use("/audio", express.static(path.join(__dirname, "public/audio")));
app.use("/images/uploads", express.static(path.join(__dirname, "public/images/uploads")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));

// Session + flash
app.use(session({ secret: process.env.SESSION_SECRET || "dev_secret", resave: false, saveUninitialized: false }));
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Routes
app.get("/", (req, res) => res.render("index"));
app.use("/api/songs", songRoutes);

// 404
app.use((req, res) => res.status(404).send("Oops! Route not found."));

// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
