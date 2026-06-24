const Booking = require("../models/Booking");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");
const { AppError } = require("../middleware/errorMiddleware");

const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId || !rating) {
    throw new AppError("Booking and rating are required", 400);
  }

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.customer.toString() !== req.user._id.toString()) {
    throw new AppError("You can review only your own booking", 403);
  }

  if (booking.status !== "completed") {
    throw new AppError("Only completed bookings can be reviewed", 400);
  }

  if (!booking.serviceman) {
    throw new AppError("Booking has no assigned serviceman", 400);
  }

  const review = await Review.create({
    customer: req.user._id,
    serviceman: booking.serviceman,
    booking: booking._id,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    data: {
      review,
    },
  });
});

const getServicemanReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ serviceman: req.params.servicemanId })
    .populate("customer", "name")
    .populate("booking", "serviceType completedAt")
    .sort({ createdAt: -1 });

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  res.json({
    success: true,
    count: reviews.length,
    data: {
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    },
  });
});

const getMyReviews = asyncHandler(async (req, res) => {
  const filters =
    req.user.role === "serviceman"
      ? { serviceman: req.user._id }
      : { customer: req.user._id };

  const reviews = await Review.find(filters)
    .populate("customer", "name")
    .populate("serviceman", "name")
    .populate("booking", "serviceType completedAt")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: reviews.length,
    data: {
      reviews,
    },
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  const isOwner = review.customer.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    throw new AppError("You cannot delete this review", 403);
  }

  await review.deleteOne();

  res.json({
    success: true,
    data: null,
  });
});

module.exports = {
  createReview,
  getServicemanReviews,
  getMyReviews,
  deleteReview,
};
