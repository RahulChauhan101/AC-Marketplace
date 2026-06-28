const Booking = require("../models/Booking");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { AppError } = require("../middleware/errorMiddleware");

const populateBooking = (query) =>
  query
    .populate("customer", "name email phone")
    .populate("serviceman", "name email phone serviceCategories serviceArea");

const toId = (value) => value?._id?.toString() || value?.toString();

const canAccessBooking = (user, booking) => {
  if (user.role === "admin") {
    return true;
  }

  if (user.role === "customer") {
    return toId(booking.customer) === user._id.toString();
  }

  return toId(booking.serviceman) === user._id.toString();
};

const createBooking = asyncHandler(async (req, res) => {
  const {
    serviceType,
    issueDescription,
    acDetails,
    address,
    scheduledAt,
    notes,
  } = req.body;

  if (!serviceType || !issueDescription || !address || !scheduledAt) {
    throw new AppError("Service type, issue description, address and schedule are required", 400);
  }

  const booking = await Booking.create({
    customer: req.user._id,
    serviceType,
    issueDescription,
    acDetails,
    address,
    scheduledAt,
    notes: {
      customer: notes,
    },
  });

  res.status(201).json({
    success: true,
    data: {
      booking,
    },
  });
});

const getBookings = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.user.role === "customer") {
    filters.customer = req.user._id;
  }

  if (req.user.role === "serviceman") {
    filters.serviceman = req.user._id;
  }

  if (req.query.status) {
    filters.status = req.query.status;
  }

  const bookings = await populateBooking(
    Booking.find(filters).sort({ scheduledAt: -1, createdAt: -1 })
  );

  res.json({
    success: true,
    count: bookings.length,
    data: {
      bookings,
    },
  });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await populateBooking(Booking.findById(req.params.id));

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (!canAccessBooking(req.user, booking)) {
    throw new AppError("You cannot access this booking", 403);
  }

  res.json({
    success: true,
    data: {
      booking,
    },
  });
});

const assignServiceman = asyncHandler(async (req, res) => {
  const { servicemanId, serviceCharge = 0, partsCharge = 0 } = req.body;

  const serviceman = await User.findOne({
    _id: servicemanId,
    role: "serviceman",
    isActive: true,
  });

  if (!serviceman) {
    throw new AppError("Active serviceman not found", 404);
  }

  const totalAmount = Number(serviceCharge) + Number(partsCharge);

  const booking = await populateBooking(
    Booking.findByIdAndUpdate(
      req.params.id,
      {
        serviceman: serviceman._id,
        status: "confirmed",
        pricing: {
          serviceCharge,
          partsCharge,
          totalAmount,
          currency: "INR",
        },
      },
      { new: true, runValidators: true }
    )
  );

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  res.json({
    success: true,
    data: {
      booking,
    },
  });
});

const acceptBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.serviceman) {
    throw new AppError("Booking is already assigned", 400);
  }

  if (booking.status !== "pending") {
    throw new AppError("Only pending bookings can be accepted", 400);
  }

  booking.serviceman = req.user._id;
  booking.status = "confirmed";
  await booking.save();

  const updatedBooking = await populateBooking(Booking.findById(booking._id));

  res.json({
    success: true,
    data: {
      booking: updatedBooking,
    },
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, servicemanNote, adminNote } = req.body;
  const allowedStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError("Invalid booking status", 400);
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (!canAccessBooking(req.user, booking)) {
    throw new AppError("You cannot update this booking", 403);
  }

  booking.status = status;
  booking.notes = booking.notes || {};

  if (status === "completed") {
    booking.completedAt = new Date();
  }

  if (servicemanNote && req.user.role === "serviceman") {
    booking.notes.serviceman = servicemanNote;
  }

  if (adminNote && req.user.role === "admin") {
    booking.notes.admin = adminNote;
  }

  await booking.save();

  const updatedBooking = await populateBooking(Booking.findById(booking._id));

  res.json({
    success: true,
    data: {
      booking: updatedBooking,
    },
  });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const isOwner = booking.customer.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    throw new AppError("You cannot cancel this booking", 403);
  }

  if (["completed", "cancelled"].includes(booking.status)) {
    throw new AppError("Completed or cancelled bookings cannot be cancelled", 400);
  }

  booking.status = "cancelled";
  booking.cancellationReason = req.body.reason;
  await booking.save();

  res.json({
    success: true,
    data: {
      booking,
    },
  });
});

const getAvailableBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    status: "pending",
    serviceman: { $exists: false },
  }).populate("customer", "name phone");

  res.json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

module.exports = {
  acceptBooking,
  createBooking,
  getBookings,
  getBookingById,
  assignServiceman,
  updateBookingStatus,
  cancelBooking,
  getAvailableBookings,
};
