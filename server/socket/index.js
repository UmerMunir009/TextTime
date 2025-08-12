const { Server } = require("socket.io");
const { User, Group } = require("../models");
const { where } = require("sequelize");

let io;
const usersSocketMap = {}; // { userId: socketId }

const getUserSocket = (userId) => {
  return usersSocketMap[userId];
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://texttime-production-21e4.up.railway.app",
      ],
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

    socket.on("typing", ({ from, to }) => {
      const recieverSocket = getUserSocket(to);
      if (recieverSocket) {
        socket.to(recieverSocket).emit("typing-indicator", { from });
      }
    });

    socket.on("group-created", async({ by, groupId, members }) => {
      const includeOptions = [{model: User,as: "creator", attributes: ["name", "email", "profilePic"]}];
      const groupInfo = await Group.findOne({
          where: { id: groupId },
          attributes: ["id", "name", "description", "group_icon", "createdAt"],
          include: includeOptions
      });
      const plainGroupInfo = groupInfo.get({ plain: true });
      members.forEach((userId) => {
        const recieverSocket = getUserSocket(userId);
        if (recieverSocket) {
          io.to(recieverSocket).emit("group-created-notification", {
            by,
            plainGroupInfo
          });
        }
      });
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log("🔴Client disconnected:", socket.id);

      const lastseen = new Date();
      await User.update({ last_seen: lastseen }, { where: { id: userId } });

      //removing the user that got disconected
      delete usersSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(usersSocketMap));
      io.emit("userLastseen", { lastseen, userId });
    });
  });
};

// Export initializer and instance getter
module.exports = {
  initSocket,
  getIO: () => io,
  getUserSocket,
};
