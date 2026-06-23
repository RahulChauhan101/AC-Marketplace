const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/ac_marketplace";

  try {
    const conn = await mongoose.connect(uri, {
      dbName: "ac_marketplace",
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`
    );

    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
    return null;
  }
};

module.exports = connectDB;