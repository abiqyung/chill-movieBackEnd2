const express = require("express");

const UserController = require("../controller/users.js");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", UserController.createNewUser);
router.get("/", authMiddleware, UserController.getUserById);
router.patch("/:user_id", UserController.updateUser);
router.delete("/:user_id", UserController.deleteUser);
router.post("/login", UserController.loginUser);
router.get("/verifikasi-email", UserController.verifyEmail);

module.exports = router;
