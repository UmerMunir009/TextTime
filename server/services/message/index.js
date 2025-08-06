const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const cloudinary = require("cloudinary").v2;
const { User, Message } = require("../../models");
const {  getIO, getRecieverSocket} = require('../../socket');
const { Op } = require("sequelize");

const getAllUsers = asyncErrorHandler(async (req, res) => {
  const users = await User.findAll({
    where: {
      id: {
        [Op.ne]: req.user.id,
      },
    },
    attributes: { exclude: ["password"] },
    raw: true,
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
  const recieverSocket=getRecieverSocket(userIdToSendMsg)
  const io=getIO()
  if (recieverSocket){
    io.to(recieverSocket).emit('newMessage',message)
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
