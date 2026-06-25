require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const configureDns = require("./src/config/dns");

configureDns();

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();