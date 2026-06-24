const express = require("express");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("customer"));

router.post("/bookings/:bookingId/order", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

module.exports = router;
