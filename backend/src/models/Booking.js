const mongoose = require("mongoose");
const serviceCategories = require("../constants/serviceCategories");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    serviceType: {
      type: String,
      enum: serviceCategories,
      required: true,
    },
    issueDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    acDetails: {
      brand: String,
      model: String,
      capacity: String,
      acType: {
        type: String,
        enum: ["split", "window", "central", "portable", "other"],
        default: "split",
      },
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: String,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    pricing: {
      serviceCharge: { type: Number, min: 0, default: 0 },
      partsCharge: { type: Number, min: 0, default: 0 },
      totalAmount: { type: Number, min: 0, default: 0 },
      currency: { type: String, default: "INR" },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "created", "paid", "failed", "refunded"],
      default: "pending",
    },
    notes: {
      customer: String,
      serviceman: String,
      admin: String,
    },
    cancellationReason: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ serviceman: 1, scheduledAt: 1 });
bookingSchema.index({ status: 1, scheduledAt: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
