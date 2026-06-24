const express = require("express");
const {
  getDashboard,
  getUsers,
  updateUserStatus,
} = require("../controllers/adminController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.patch("/users/:id", updateUserStatus);

module.exports = router;
