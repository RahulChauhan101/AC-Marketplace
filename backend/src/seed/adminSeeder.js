require("dotenv").config();

const configureDns = require("../config/dns");
const connectDB = require("../config/db");
const User = require("../models/User");

configureDns();

const createAdmin = async () => {
  try {
    const adminName = process.env.ADMIN_NAME || "Super Admin";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    await connectDB();

    const exists = await User.findOne({
      email: adminEmail,
    });

    if (exists) {
      console.log(`Admin already exists: ${adminEmail}`);
      process.exit(0);
    }

    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log(`Admin created successfully: ${adminEmail}`);

    process.exit(0);
  } catch (err) {
    console.error("Admin seeding failed:", err.message);
    process.exit(1);
  }
};

createAdmin();