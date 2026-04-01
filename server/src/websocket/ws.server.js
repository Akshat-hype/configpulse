const { Server } = require("socket.io");

let io;

function initWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

function emitConfigUpdate(data) {
  if (io) {
    io.emit("configUpdated", data);
  }
}

module.exports = {
  initWebSocket,
  emitConfigUpdate,
};