const dbPool = require("../config/database");

const getUserById = (user_id) => {
  const SQLQuery = "SELECT * FROM users WHERE user_id = ?";
  return dbPool.execute(SQLQuery, [user_id]);
};

const createNewUser = (body) => {
  const SQLQuery = `INSERT INTO users (fullname, username, email, password, verification_token) 
                    VALUES (?, ?, ?, ?, ?)`;
  const values = [
    body.fullname,
    body.username,
    body.email,
    body.password,
    body.verification_token,
  ];

  return dbPool.execute(SQLQuery, values);
};

const findUserByToken = (token) => {
  const SQLQuery = "SELECT * FROM users WHERE verification_token = ?";
  return dbPool.execute(SQLQuery, [token]);
};

const verifyUser = (user_id) => {
  const SQLQuery =
    "UPDATE users SET verification_token = NULL WHERE user_id = ?";
  return dbPool.execute(SQLQuery, [user_id]);
};

const updateUser = (body, user_id) => {
  let SQLQuery = `UPDATE users SET fullname = ?, username = ?, email = ?`;
  const values = [body.fullname, body.username, body.email];

  if (body.password) {
    SQLQuery += `, password = ?`;
    values.push(body.password);
  }

  SQLQuery += ` WHERE user_id = ?`;
  values.push(user_id);

  return dbPool.execute(SQLQuery, values);
};

const deleteUser = (user_id) => {
  const SQLQuery = "DELETE FROM users WHERE user_id = ?";
  return dbPool.execute(SQLQuery, [user_id]);
};

const findUserByEmail = (email) => {
  const SQLQuery = "SELECT * FROM users WHERE email = ?";
  return dbPool.execute(SQLQuery, [email]);
};

module.exports = {
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  findUserByEmail,
  findUserByToken,
  verifyUser,
};
