const crypto = require("crypto");

const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const asyncHandler = require("../utils/asyncHandler");
const { returnUpdatedDocument } = require("../utils/mongooseOptions");
const getRazorpay = require("../utils/razorpay");
const { AppError } = require("../middleware/errorMiddleware");

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.customer.toString() !== req.user._id.toString()) {
    throw new AppError("You can pay only for your own booking", 403);
  }

  if (booking.paymentStatus === "paid") {
    throw new AppError("Booking is already paid", 400);
  }

  if (!booking.pricing.totalAmount || booking.pricing.totalAmount <= 0) {
    throw new AppError("Booking amount has not been set", 400);
  }

  const razorpay = getRazorpay();
  const amountInPaise = Math.round(booking.pricing.totalAmount * 100);
  const receipt = `booking_${booking._id.toString().slice(-24)}`;

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: booking.pricing.currency || "INR",
    receipt,
    notes: {
      bookingId: booking._id.toString(),
      customerId: req.user._id.toString(),
    },
  });

  const payment = await Payment.create({
    paymentType: "booking",
    booking: booking._id,
    customer: req.user._id,
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    status: "created",
  });

  booking.paymentStatus = "created";
  await booking.save();

  res.status(201).json({
    success: true,
    data: {
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
      payment,
    },
  });
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new AppError("Razorpay payment verification fields are required", 400);
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new AppError("Invalid Razorpay signature", 400);
  }

  const payment = await Payment.findOne({ razorpayOrderId });

  if (!payment) {
    throw new AppError("Payment record not found", 404);
  }

  if (payment.customer.toString() !== req.user._id.toString()) {
    throw new AppError("You cannot verify this payment", 403);
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "paid";
  await payment.save();

  const booking = await Booking.findByIdAndUpdate(
    payment.booking,
    { paymentStatus: "paid" },
    returnUpdatedDocument
  );

  res.json({
    success: true,
    data: {
      payment,
      booking,
    },
  });
});

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
