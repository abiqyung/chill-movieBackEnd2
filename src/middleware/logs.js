const jwt = require("jsonwebtoken");

const logRequest = (req, res, next) => {
  console.log("Middleware Success", req.method, req.path);
  next();
};

module.exports = { logRequest };
