const express = require("express");
const {
  createReview,
  deleteReview,
  getMyReviews,
  getServicemanReviews,
} = require("../controllers/reviewController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/serviceman/:servicemanId", getServicemanReviews);

router.use(protect);

router.get("/me", getMyReviews);
router.post("/", authorize("customer"), createReview);
router.delete("/:id", authorize("customer", "admin"), deleteReview);

module.exports = router;
