require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/User");

const createAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  await connectDB();

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

  if (existingAdmin) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    return;
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });

  console.log(`Admin created: ${ADMIN_EMAIL}`);
};

createAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Admin creation failed:", error.message);
    process.exit(1);
  });
