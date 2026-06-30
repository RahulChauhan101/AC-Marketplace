const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentType: {
      type: String,
      enum: ["booking", "subscription"],
      default: "booking",
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    serviceman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: String,
    razorpaySignature: String,
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    receipt: String,
    failureReason: String,
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ customer: 1, createdAt: -1 });
paymentSchema.index({ booking: 1, createdAt: -1 });
paymentSchema.index({ serviceman: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
