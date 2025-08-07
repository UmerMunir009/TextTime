const { Server } = require("socket.io");

let io;
const usersSocketMap = {}; // { userId: socketId }

const getUserSocket = (userId) => {
  return usersSocketMap[userId];
};


const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173",''],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢New client connected:", socket.id);

    //updating onlineUsers map
    const userId = socket.handshake.query.userId;
    if (userId) {
      usersSocketMap[userId] = socket.id;
    }
    //emitting to all connected  that this user became online
    io.emit("getOnlineUsers", Object.keys(usersSocketMap));

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("🔴Client disconnected:", socket.id);
      //removing the user that got disconected
      delete usersSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(usersSocketMap));
    });
  });
};

// Export initializer and instance getter
module.exports = {
  initSocket,
  getIO: () => io,
  getUserSocket
};
