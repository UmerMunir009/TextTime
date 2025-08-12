const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { Group, Group_Member,User } = require("../../models");
const cloudinary = require("cloudinary").v2;


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
      attributes: ["id", "name","description","group_icon","createdAt"],
      include: [{model: User,as: "creator",attributes: ["name", "email", "profilePic"] 
        }
      ]
    },
  ];

  const data = await Group_Member.findAll({
    where: { user_id: req.user.id },
    include: includeOptions,
    order: [[{ model: Group, as: "group" }, "createdAt", "DESC"]]
  });
  const groups = data.map((record) => record.group);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.GROUP_CREATED,
    data: groups,
  });
});


const getMembers = asyncErrorHandler(async (req, res) => {
  const groupId=req.params.id

  const includeOptions = [
    {
      model: User,
      as: "member",
      attributes: ["name", "email", "profilePic"] 
    },
  ];
  const data = await Group_Member.findAll({
    where: { group_id: groupId },
    include:includeOptions
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: data.map(record => record.member),
  });
});

const updateGroupInfo = asyncErrorHandler(async (req, res) => {
  const groupId=req.params.id
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
    message: 'Group info updateded',
    updated_icon: uploadresponse.secure_url,
  });
});

module.exports = {
  createGroup,
  getGroups,
  getMembers,
  updateGroupInfo
};
