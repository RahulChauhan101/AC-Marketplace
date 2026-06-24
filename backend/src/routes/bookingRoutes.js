const express = require("express");
const {
  assignServiceman,
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getBookings)
  .post(authorize("customer"), createBooking);

router
  .route("/:id")
  .get(getBookingById)
  .patch(authorize("serviceman", "admin"), updateBookingStatus);

router.patch("/:id/assign", authorize("admin"), assignServiceman);
router.patch("/:id/cancel", authorize("customer", "admin"), cancelBooking);

module.exports = router;
