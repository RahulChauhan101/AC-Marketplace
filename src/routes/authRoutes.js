const express = require("express");
const router = express.Router();

const { register } = require("../controllers/authController");

router.get("/register", (req, res) => {
  res.status(200).json({
    success: false,
    message: "Use POST /api/auth/register to create a new user.",
  });
});

router.post("/register", register);

module.exports = router;