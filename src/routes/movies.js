const express = require("express");
const MoviesController = require("../controller/movies.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, MoviesController.createNewMovie);
router.get("/", MoviesController.getAllMovies);
router.patch("/:movie_id", authMiddleware, MoviesController.updateMovie);
router.delete("/:movie_id", authMiddleware, MoviesController.deleteMovie);
router.get("/search", MoviesController.searchMovies);
router.post(
  "/upload",
  upload.single("poster"),
  MoviesController.uploadMoviePoster
);
module.exports = router;
