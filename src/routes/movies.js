const express = require("express");
const MoviesController = require("../controller/movies.js");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define where to store the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File naming convention
  },
});

// Initialize upload middleware with storage
const upload = multer({ storage: storage });

// Routes
router.post("/", authMiddleware, MoviesController.createNewMovie);
router.get("/", MoviesController.getAllMovies);
router.patch("/:movie_id", authMiddleware, MoviesController.updateMovie);
router.delete("/:movie_id", authMiddleware, MoviesController.deleteMovie);
router.get("/search", MoviesController.searchMovies);

// Upload route with multer middleware
router.post(
  "/upload",
  upload.single("poster"), // Middleware to handle single file upload
  MoviesController.uploadMoviePoster
);

module.exports = router;
