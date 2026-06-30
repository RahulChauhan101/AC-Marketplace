const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const { sanitizeUser } = require("../utils/userSerializer");
const { returnUpdatedDocument } = require("../utils/mongooseOptions");
const { AppError } = require("../middleware/errorMiddleware");

const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role = "customer",
    phone,
    address,
    serviceCategories,
    serviceArea,
  } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  if (!["customer", "serviceman"].includes(role)) {
    throw new AppError("Only customer and serviceman registration is allowed", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    address,
    serviceCategories: role === "serviceman" ? serviceCategories : undefined,
    serviceArea: role === "serviceman" ? serviceArea : undefined,
  });

  res.status(201).json({
    success: true,
    token: generateToken(user),
    data: {
      user: sanitizeUser(user),
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Your account is disabled", 403);
  }

  res.json({
    success: true,
    token: generateToken(user),
    data: {
      user: sanitizeUser(user),
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "phone",
    "address",
    "serviceCategories",
    "serviceArea",
    "isAvailable",
    "experienceYears",
    "idProof",
  ];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (req.user.role !== "serviceman") {
    delete updates.serviceCategories;
    delete updates.serviceArea;
    delete updates.isAvailable;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, returnUpdatedDocument);

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters", 400);
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
});

module.exports = {
  changePassword,
  register,
  login,
  getMe,
  updateProfile,
};