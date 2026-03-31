const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./db/connection");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 ConfigPulse server running on http://localhost:${PORT}`);
  });
};

start();