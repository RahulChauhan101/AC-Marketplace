const express = require("express");
const {
  changePassword,
  getMe,
  login,
  register,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/me", protect, updateProfile);
router.patch("/change-password", protect, changePassword);

module.exports = router;