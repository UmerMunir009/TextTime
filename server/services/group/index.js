const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Group, Group_Member, User, Group_Message } = require("../../models");
const cloudinary = require("cloudinary").v2;
const { getIO, getUserSocket } = require("../../socket");

const createGroup = asyncErrorHandler(async (req, res) => {
  const { name, description, members } = req.body;
  const created_by = req.user.id;
  if (!name || !Array.isArray(members) || members.length === 0) {
    return res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: "Group name and members are required",
    });
  }

  const groupData = {
    name,
    description,
    created_by,
  };

  const group = (await Group.create(groupData)).get({ plain: true });
  for (const member of members) {
    await Group_Member.create({ group_id: group.id, user_id: member });
  }
  await Group_Member.create({ group_id: group.id, user_id: created_by });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.GROUP_CREATED,
    data: group,
  });
});

const getGroups = asyncErrorHandler(async (req, res) => {
  const includeOptions = [
    {
      model: Group,
      as: "group",
      attributes: ["id", "name", "description", "group_icon", "createdAt"],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["name", "email", "profilePic"],
        },
      ],
    },
  ];

  const data = await Group_Member.findAll({
    where: { user_id: req.user.id },
    include: includeOptions,
    order: [[{ model: Group, as: "group" }, "createdAt", "DESC"]],
  });
  const groups = data.map((record) => record.group);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.GROUP_CREATED,
    data: groups,
  });
});

const getMembers = asyncErrorHandler(async (req, res) => {
  const groupId = req.params.id;

  const includeOptions = [
    {
      model: User,
      as: "member",
      attributes: ["id","name", "email", "profilePic"],
    },
  ];
  const data = await Group_Member.findAll({
    where: { group_id: groupId },
    include: includeOptions,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: data.map((record) => record.member),
  });
});

const updateGroupInfo = asyncErrorHandler(async (req, res) => {
  const groupId = req.params.id;
  const image = req.file;

  if (!image) {
    return res.status(STATUS_CODES.REQUIRED).json({
      statusCode: STATUS_CODES.REQUIRED,
      message: "Image is required",
    });
  }

  const base64Image = `data:${image.mimetype};base64,${image.buffer.toString(
    "base64"
  )}`;
  const uploadresponse = await cloudinary.uploader.upload(base64Image);

  await Group.update(
    { group_icon: uploadresponse.secure_url },
    {
      where: {
        id: groupId,
      },
      returning: true,
    }
  );
  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: "Group info updateded",
    updated_icon: uploadresponse.secure_url,
  });
});

const sendMessage = asyncErrorHandler(async (req, res) => {
  const groupId = req.params.id;
  const senderId = req.user.id;
  const { text } = req.body;
  const members = JSON.parse(req.body.members);
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

  const createdMessage = await Group_Message.create({
    groupId,
    senderId,
    text: text,
    image: imgUrl,
  });

//this is beacause i am fetching previous messages in this format
  const message = await Group_Message.findOne({
    where: { id: createdMessage.id },
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "name", "profilePic"],
      },
    ],
    attributes: { exclude: ["id", "senderId"] },
  });

  const io = getIO();
  members.forEach((member) => {
    const recieverSocket=getUserSocket(member?.id)
    if (recieverSocket) {
      io.to(recieverSocket).emit("newGroupMsg", message);
    }
    
  });
 
  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: message,
  });
});

const getChat = asyncErrorHandler(async (req, res) => {
  const gId = req.params.id;

  const includeOptions = [
    {
      model: User,
      as: "sender",
      attributes: ["id", "name", "profilePic"],
    },
  ];
  const messages = await Group_Message.findAll({
    where: {
      groupId: gId,
    },
    include: includeOptions,
    order: [["createdAt", "ASC"]],
    attributes: { exclude: ["id", "senderId"] },
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.DATA_FOUND,
    data: messages,
  });
});

const addMember = asyncErrorHandler(async (req, res) => {
  console.log('In the handler')
  const gId = req.params.id;
  const {email,groupMembers}=req.body
  const user = await User.findOne({ where: { email }, raw: true });
  
  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: 'User is not registered on app'
    });
  }
  const exists=await Group_Member.findOne({where:{group_id:gId,user_id:user.id}})
  
  if (exists) {
    return res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: 'User is already in group'
    });
  }
  await Group_Member.create({group_id:gId,user_id:user.id})
  const group = await Group.findOne({ where: { id:gId }, raw: true });


  //real-time notify to other group member :
  const io = getIO();
  groupMembers.forEach((member) => {
  const socketId = getUserSocket(member.id);
  if (!socketId) return;
  if (member.id === req.user.id || member.id === user.id) return;

  io.to(socketId).emit("memberAdded", {
    type: "otherMember",
    by: req.user.name,
    newMember: user.name,
    group: group.name
  });
});
const newMemberSocket = getUserSocket(user.id);
if (newMemberSocket) {
  io.to(newMemberSocket).emit("memberAdded", {
    type: "newMember",
    by: req.user.name,
    newMember: user.name,
    group: group.name
  });
}



  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: "User added to group",
  });
});

module.exports = {
  createGroup,
  getGroups,
  getMembers,
  updateGroupInfo,
  sendMessage,
  getChat,
  addMember
};
