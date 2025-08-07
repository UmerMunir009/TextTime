const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { User, Friend } = require("../../models");

const addFriend = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;

  if (req.user.email === email) {
    res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: "You cant add yourself.",
    });
  }
  const user = await User.findOne({ where: { email }, raw: true });
  console.log(user);
  if (!user) {
    res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: "User does not exists",
    });
  }
  const data = await Friend.create({
    user_id: req.user.id,
    friend_id: user.id,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FRIEND_ADDED,
    data: data,
  });
});

module.exports = {
  addFriend,
};
