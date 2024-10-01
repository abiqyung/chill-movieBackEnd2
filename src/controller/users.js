const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const UsersModel = require("../models/users");

const getUserById = async (req, res) => {
  const user_id = req.user.user_id; // Get user_id from req.user (decoded token)
  try {
    const [data] = await UsersModel.getUserById(user_id);

    res.json({
      message: "Get Users Success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const createNewUser = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  try {
    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a verification token using uuid
    const verificationToken = uuidv4();

    // Create a new user with the hashed password
    const userData = {
      fullname,
      username,
      email,
      password: hashedPassword,
      verification_token: verificationToken,
    };

    await UsersModel.createNewUser(userData);
    await sendVerificationEmail(email, verificationToken);

    res.json({
      message:
        "User registration successful. Please check your email to verify your account.",
      data: { fullname, username, email },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

// Function to send verification email using Mailtrap
const sendVerificationEmail = async (email, token) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Mailtrap SMTP Host
      port: process.env.EMAIL_PORT, // Mailtrap SMTP Port
      auth: {
        user: process.env.EMAIL_USER, // Mailtrap username
        pass: process.env.EMAIL_PASS, // Mailtrap password
      },
    });

    let mailOptions = {
      from: "noreply@yourapp.com",
      to: email,
      subject: "Verify your email for Movie App",
      text: `Please verify your email by clicking on the following link: http://localhost:4000/verifikasi-email?token=${token}`,
    };

    console.log("Attempting to send email...");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await UsersModel.findUserByEmail(email);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found. Invalid email or password.",
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        user_id: user.user_id,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { fullname, username, email, password } = req.body;
  try {
    let updatedData = { fullname, username, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    await UsersModel.updateUser(updatedData, user_id);
    res.json({
      message: "Update User Success",
      data: {
        user_id: user_id,
        ...updatedData,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    await UsersModel.deleteUser(user_id);
    res.json({
      message: "Delete User Success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const [rows] = await UsersModel.findUserByToken(token);

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid Verification Token",
      });
    }

    const user = rows[0];

    await UsersModel.verifyUser(user.user_id);

    res.json({
      message: "Email Verified Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      serverMessage: error.message,
    });
  }
};

module.exports = {
  getUserById,
  createNewUser,
  loginUser,
  updateUser,
  deleteUser,
  verifyEmail,
};
