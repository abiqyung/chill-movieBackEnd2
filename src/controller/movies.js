const MovieModel = require("../models/movies");

// Create a new movie
const createNewMovie = async (req, res) => {
  try {
    const newMovie = await MovieModel.createMovie(req.body);
    res.status(201).json({
      message: "Movie created successfully",
      movie: newMovie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

// Get all movies with optional sorting, filtering, and searching
const getAllMovies = async (req, res) => {
  try {
    const movies = await MovieModel.getAllMovies(req.query); // Passing query params for filtering and sorting
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

// Update a movie
const updateMovie = async (req, res) => {
  const { movie_id } = req.params;
  try {
    const updatedMovie = await MovieModel.updateMovie(movie_id, req.body);
    res.status(200).json({
      message: "Movie updated successfully",
      movie: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

// Delete a movie
const deleteMovie = async (req, res) => {
  const { movie_id } = req.params;
  try {
    await MovieModel.deleteMovie(movie_id);
    res.status(200).json({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

// Search or filter movies
const searchMovies = async (req, res) => {
  try {
    const movies = await MovieModel.searchMovies(req.query);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

const uploadMoviePoster = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the file information or handle further storage
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file, // Details of the uploaded file
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      serverMessage: error.message,
    });
  }
};

module.exports = {
  createNewMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  searchMovies,
  uploadMoviePoster,
};
