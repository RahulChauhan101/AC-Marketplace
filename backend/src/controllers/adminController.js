const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { AppError } = require("../middleware/errorMiddleware");

const getDashboard = asyncHandler(async (req, res) => {
  const [
    users,
    customers,
    servicemen,
    bookings,
    pendingBookings,
    completedBookings,
    paidPayments,
    reviews,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "serviceman" }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "completed" }),
    Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, revenue: { $sum: "$amount" } } },
    ]),
    Review.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      users,
      customers,
      servicemen,
      bookings,
      pendingBookings,
      completedBookings,
      reviews,
      revenue: (paidPayments[0]?.revenue || 0) / 100,
      currency: "INR",
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.role) {
    filters.role = req.query.role;
  }

  const users = await User.find(filters).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    data: {
      users,
    },
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive, role } = req.body;

  const updates = {};

  if (typeof isActive === "boolean") {
    updates.isActive = isActive;
  }

  if (role !== undefined) {
    if (!["customer", "serviceman", "admin"].includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    updates.role = role;
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    success: true,
    data: {
      user,
    },
  });
});

module.exports = {
  getDashboard,
  getUsers,
  updateUserStatus,
};
