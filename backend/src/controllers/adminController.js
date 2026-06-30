const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { sanitizeUser } = require("../utils/userSerializer");
const { returnUpdatedDocument } = require("../utils/mongooseOptions");
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
    ratingStats,
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
    Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]),
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
      averageRating: Number((ratingStats[0]?.averageRating || 0).toFixed(1)),
      revenue: (paidPayments[0]?.revenue || 0) / 100,
      currency: "INR",
    },
  });
});

const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const admin = await User.create({
    name,
    email,
    password,
    phone,
    address,
    role: "admin",
  });

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: {
      user: sanitizeUser(admin),
    },
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.role) {
    filters.role = req.query.role;
  }

  const users = await User.find(filters).sort({ createdAt: -1 }).lean();

  res.json({
    success: true,
    count: users.length,
    data: {
      users: users.map((user) => sanitizeUser({ ...user, _id: user._id })),
    },
  });
});

const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("customer", "name email")
    .populate("serviceman", "name email phone")
    .populate("booking", "serviceType completedAt status")
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

  const user = await User.findByIdAndUpdate(req.params.id, updates, returnUpdatedDocument);

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
  createAdmin,
  getDashboard,
  getReviews,
  getUsers,
  updateUserStatus,
};
