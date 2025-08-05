const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { generateToken } = require("../../utils/jwtToken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const { User } = require("../../models");

const signup = asyncErrorHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const isExist = await User.findOne({ where: { email }, raw: true });

  if (isExist) {
    return res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: "Email already used.",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userData = {
    name,
    email,
    password: hashedPassword,
    // profilePic:public_id
  };
  const data = await User.create(userData);
  const user = await User.findByPk(data.id, { raw: true }); // plain object (very important)
   const { profilePic, ...userWithoutPic } = user;
  let token = generateToken(userWithoutPic);
  res.cookie("token", token, {
    maxAge: 5 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.CREATED,
    data: data,
  });
});

const login = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email }, raw: true });

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: 'Email doesnot exists'
    });
  }

  const isPassword = await bcrypt.compare(password, user?.password);
  if (!isPassword) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: "Invalid email or password",
    });
  }
  const { profilePic, ...userWithoutPic } = user;
  let token = generateToken(userWithoutPic);

  res.cookie("token", token, {
    maxAge: 5 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.LOGIN,
    data: user,
  });
});

const logout = asyncErrorHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 0,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.LOGOUT,
  });
});

const updateProfile = asyncErrorHandler(async (req, res) => {
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

  await User.update(
    { profilePic: uploadresponse.secure_url },
    {
      where: {
        id: req.user.id,
      },
      returning: true,
    }
  );
  const data = await User.findByPk(req.user?.id);
  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: 'Profile updateded',
    data: data,
  });
});

const checkAuth = asyncErrorHandler(async (req, res) => {

  const user = await User.findByPk(req.user.id);


  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.VERIFIED,
    data:user,
  });
});

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};
