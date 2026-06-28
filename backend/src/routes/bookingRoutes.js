const express = require("express");
const mongoose = require("mongoose");
const {
  acceptBooking,
  assignServiceman,
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
  updateBookingStatus,
  getAvailableBookings,
} = require("../controllers/bookingController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

const validateBookingId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking id",
    });
  }

  return next();
};

router.use(protect);

router.get(
  "/available",
  authorize("serviceman", "admin"),
  getAvailableBookings
);

router
  .route("/")
  .get(getBookings)
  .post(authorize("customer"), createBooking);

router
  .route("/:id")
  .all(validateBookingId)
  .get(getBookingById)
  .patch(authorize("serviceman", "admin"), updateBookingStatus);

router.patch("/:id/assign", validateBookingId, authorize("admin"), assignServiceman);
router.patch("/:id/accept", validateBookingId, authorize("serviceman"), acceptBooking);
router.patch("/:id/cancel", validateBookingId, authorize("customer", "admin"), cancelBooking);

module.exports = router;
