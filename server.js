require("dotenv").config();
console.log("ENV CHECK:", process.env.MONGO_URI);
const app = require("./src/app");
const connectDB = require("./src/config/db");

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();