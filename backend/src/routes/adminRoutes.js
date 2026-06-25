const express = require("express");
const {
  createAdmin,
  getDashboard,
  getUsers,
  updateUserStatus,
} = require("../controllers/adminController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.post(
  "/create-admin",
  protect,
  authorize("admin"),
  createAdmin
);
router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.patch("/users/:id", updateUserStatus);

module.exports = router;
