const dbPool = require("../config/database");

const createMovie = (body) => {
  const SQLQuery = `INSERT INTO movies (name, overview, original_language, genre_ids, release_date)
                    VALUES (?, ?, ?, ?, ?)`;
  return dbPool.execute(SQLQuery, [
    body.name,
    body.overview,
    body.original_language,
    body.genre_ids,
    body.release_date,
  ]);
};

// Get all movies with optional filters or sorting
const getAllMovies = (query) => {
  let SQLQuery = "SELECT * FROM movies WHERE 1=1";
  const values = [];

  // Filter by name (search by name)
  if (query.name) {
    SQLQuery += " AND name LIKE ?";
    values.push(`%${query.name}%`);
  }

  // Filter by genre
  if (query.genre) {
    SQLQuery += " AND genre_ids LIKE ?";
    values.push(`%${query.genre}%`);
  }

  // Sort by release date
  if (query.sort === "release_date") {
    SQLQuery += " ORDER BY release_date DESC";
  }

  return dbPool.execute(SQLQuery, values);
};

// Update a movie
const updateMovie = (movie_id, body) => {
  const SQLQuery = `UPDATE movies SET name = ?, overview = ?, original_language = ?, genre_ids = ?, release_date = ?
                    WHERE movie_id = ?`;
  return dbPool.execute(SQLQuery, [
    body.name,
    body.overview,
    body.original_language,
    body.genre_ids,
    body.release_date,
    movie_id,
  ]);
};

// Delete a movie
const deleteMovie = (movie_id) => {
  const SQLQuery = "DELETE FROM movies WHERE movie_id = ?";
  return dbPool.execute(SQLQuery, [movie_id]);
};

// Search or filter movies
const searchMovies = (query) => {
  let SQLQuery = "SELECT * FROM movies WHERE 1=1";
  const values = [];

  // Search by name
  if (query.name) {
    SQLQuery += " AND name LIKE ?";
    values.push(`%${query.name}%`);
  }

  // Filter by genre
  if (query.genre) {
    SQLQuery += " AND genre_ids LIKE ?";
    values.push(`%${query.genre}%`);
  }

  // Sort by release date if requested
  if (query.sort === "release_date") {
    SQLQuery += " ORDER BY release_date DESC";
  }

  return dbPool.execute(SQLQuery, values);
};

module.exports = {
  createMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  searchMovies,
};
