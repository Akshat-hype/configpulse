const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./src/app");
const connectDB = require("./db/connection");
const { initWebSocket } = require("./src/websocket/ws.server");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  
  const server = http.createServer(app);
  initWebSocket(server);

  server.listen(PORT, () => {
    console.log(`🚀 ConfigPulse server running on http://localhost:${PORT}`);
  });
};

start();