const crypto = require("crypto");
const Payment = require("../models/Payment");
const User = require("../models/User");
const {
  SUBSCRIPTION_AMOUNT_PAISE,
  SUBSCRIPTION_DURATION_MS,
} = require("../constants/subscription");
const asyncHandler = require("../utils/asyncHandler");
const { returnUpdatedDocument } = require("../utils/mongooseOptions");
const getRazorpay = require("../utils/razorpay");
const { getSubscriptionSummary } = require("../utils/subscription");
const { AppError } = require("../middleware/errorMiddleware");

const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: getSubscriptionSummary(user),
  });
});

const createSubscriptionOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const summary = getSubscriptionSummary(user);

  if (summary.hasActiveSubscription) {
    throw new AppError("Your subscription is already active", 400);
  }

  const razorpay = getRazorpay();
  const receipt = `sub_${req.user._id.toString().slice(-20)}_${Date.now()}`.slice(0, 40);

  const order = await razorpay.orders.create({
    amount: SUBSCRIPTION_AMOUNT_PAISE,
    currency: "INR",
    receipt,
    notes: {
      paymentType: "subscription",
      servicemanId: req.user._id.toString(),
    },
  });

  const payment = await Payment.create({
    paymentType: "subscription",
    serviceman: req.user._id,
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    status: "created",
  });

  res.status(201).json({
    success: true,
    data: {
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
      payment,
      summary,
    },
  });
});

const verifySubscriptionPayment = asyncHandler(async (req, res) => {
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

  const payment = await Payment.findOne({
    razorpayOrderId,
    paymentType: "subscription",
  });

  if (!payment) {
    throw new AppError("Subscription payment record not found", 404);
  }

  if (payment.serviceman.toString() !== req.user._id.toString()) {
    throw new AppError("You cannot verify this payment", 403);
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = "paid";
  await payment.save();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + SUBSCRIPTION_DURATION_MS);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      subscription: {
        freeServicesUsed: req.user.subscription?.freeServicesUsed || 0,
        subscriptionPaidAt: now,
        subscriptionExpiresAt: expiresAt,
      },
    },
    returnUpdatedDocument
  );

  res.json({
    success: true,
    data: {
      payment,
      summary: getSubscriptionSummary(user),
    },
  });
});

module.exports = {
  createSubscriptionOrder,
  getSubscriptionStatus,
  verifySubscriptionPayment,
};
