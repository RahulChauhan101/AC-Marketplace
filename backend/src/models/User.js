const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "serviceman", "admin"],
      default: "customer",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    serviceCategories: [
      {
        type: String,
        // Keep in sync with shared/serviceCatalog.js and User model enum
        enum: [
          "installation",
          "repair",
          "maintenance",
          "gas-refill",
          "inspection",
          "electronics-repair",
          "tv-repair",
          "fridge-repair",
          "ac-repair",
          "cooler-repair",
          "fan-repair",
          "microwave-oven-repair",
          "light-repair",
          "electrician",
          "water-purifier-repair",
          "plumber",
          "gas-stove-repair",
        ],
      },
    ],
    serviceArea: {
      city: String,
      pincodes: [String],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profilePhoto: String,
    businessLogo: String,
    serviceImages: [String],
    experienceYears: {
      type: Number,
      min: 0,
      default: 0,
    },
    idProof: {
      aadharNumber: String,
      drivingLicenseNumber: String,
      voterIdNumber: String,
      aadharImage: String,
      drivingLicenseImage: String,
      voterIdImage: String,
      experienceCertificateImage: String,
    },
    subscription: {
      freeServicesUsed: {
        type: Number,
        default: 0,
        min: 0,
      },
      subscriptionPaidAt: Date,
      subscriptionExpiresAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);