const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const cloudinary = require("cloudinary").v2;
const { User, Message, Friend } = require("../../models");
const { getIO, getUserSocket } = require("../../socket");
const { Op } = require("sequelize");

const getAllUsers = asyncErrorHandler(async (req, res) => {
  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ user_id: req.user.id }, { friend_id: req.user.id }],
    },
    raw: true,
  });

  const friendUserIds = friends.map((f) => {
    return f.user_id === req.user.id ? f.friend_id : f.user_id;
  });

  const uniqueFriendUserIds = [...new Set(friendUserIds)];

  const users = await User.findAll({
    where: {
      id: {
        [Op.in]: uniqueFriendUserIds,
      },
    },
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.DATA_FOUND,
    data: users,
  });
});

const getChat = asyncErrorHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user.id;
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        {
          senderId: myId,
          recieverId: userToChatId,
        },
        {
          senderId: userToChatId,
          recieverId: myId,
        },
      ],
    },
    order: [["createdAt", "ASC"]],
    attributes: { exclude: ["id"] },
    raw: true,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.DATA_FOUND,
    data: messages,
  });
});

const sendMessage = asyncErrorHandler(async (req, res) => {
  const { id: userIdToSendMsg } = req.params;
  const myId = req.user.id;

  const { text } = req.body;
  const image = req.file;

  if (!text && !image) {
    return res.status(STATUS_CODES.REQUIRED).json({
      statusCode: STATUS_CODES.REQUIRED,
      message: "Message must include either text or image.",
    });
  }

  let imgUrl;
  if (image) {
    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString(
      "base64"
    )}`;
    const uploadresponse = await cloudinary.uploader.upload(base64Image);
    imgUrl = uploadresponse.secure_url;
  }

  const message = await Message.create({
    senderId: myId,
    recieverId: userIdToSendMsg,
    text,
    image: imgUrl,
  });

  //so that user dont need to refresh page on every message
  const recieverSocket = getUserSocket(userIdToSendMsg);
  const senderSocket = getUserSocket(myId);
  const io = getIO();
  if (senderSocket) {
    io.to(senderSocket).emit("newMessage", message);
  }
  if (recieverSocket) {
    io.to(recieverSocket).emit("newMessage", message);
  }

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: message,
  });
});

module.exports = {
  getAllUsers,
  getChat,
  sendMessage,
};

// const users = await User.findAll({
//     where: {
//       id: {
//         [Op.ne]: req.user.id,
//       },
//     },
//     attributes: { exclude: ["password"] },
//     raw: true,
//   });
//   res.status(STATUS_CODES.SUCCESS).json({
//     statusCode: STATUS_CODES.SUCCESS,
//     message: TEXTS.DATA_FOUND,
//     data: users,
//   });