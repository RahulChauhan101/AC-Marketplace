const User = require("../models/User");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

const fallbackUsers = global.__acMarketplaceUsers || (global.__acMarketplaceUsers = new Map());

const register = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const dbConnection = await connectDB();

    if (!dbConnection) {
      if (fallbackUsers.has(email)) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const fallbackUser = {
        _id: `${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: role || "customer",
        createdAt: new Date().toISOString(),
      };

      fallbackUsers.set(email, fallbackUser);

      return res.status(201).json({
        success: true,
        message: "User registered successfully (saved locally while the database is unavailable)",
        user: fallbackUser,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

    if (error.name === "MongoServerSelectionError" || error.name === "MongooseServerSelectionError") {
      return res.status(503).json({
        success: false,
        message: "Database connection timed out. Please try again later.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register };