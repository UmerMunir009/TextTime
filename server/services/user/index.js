const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { generateToken } = require("../../utils/jwtToken");
const { User } = require("../../models");

const create = asyncErrorHandler(async (req, res) => {

  const isExist = await User.findOne({
    where: {
      email: req.body.email
    },
    raw: true
  })

  if (isExist) {
    return res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: "Email already used.",
    });
  }

  const data = await User.create(req.body);

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });

});


const get = asyncErrorHandler(async (req, res) => {


  const data = await User.findAndCountAll({
    ...req.pagination
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });

});


const del = asyncErrorHandler(async (req, res) => {

  const data = await User.destroy({
    where: {
      id: req.params.id
    }
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.DELETED,
    data: data,
  });

});


const update = asyncErrorHandler(async (req, res) => {

  const data = await User.update(req.body, {
    where: {
      id: req.params.id
    },
    returning: true,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.UPDATED,
    data: data,
  });

});


// login user
const login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email,
      password: password
    },
    raw: true
  })

  if (user) {
    let access_token = generateToken(user);
    res.status(STATUS_CODES.SUCCESS).json({
      statusCode: STATUS_CODES.SUCCESS,
      message: TEXTS.SUCCESS,
      data: user,
      accessToken: access_token
    });

  } else {
    res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: "Invalid credentials"
    });
  }

});



module.exports = {
  login,
  create,
  get,
  update,
  del
};
