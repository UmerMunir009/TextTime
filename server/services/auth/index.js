const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { generateToken } = require("../../utils/jwtToken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const { User } = require("../../models");

const signup = asyncErrorHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // const image=req.file
  const isExist = await User.findOne({where: {email},
    raw: true,
  });

  if (isExist) {
    return res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: "Email already used.",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // const {public_id}=await cloudinary.uploader.upload(image.path)

  const userData = {
    name,
    email,
    password: hashedPassword,
    // profilePic:public_id
  };
  const data = await User.create(userData);
  const token = generateToken(userData);
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
  const user = await User.findOne({where: {email},
    raw: true
  });

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: TEXTS.NOT_FOUND,
    });
  }

  const isPassword=await bcrypt.compare(password,user?.password)
  if (!isPassword) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: 'Invalid email or password',
    });
  }
   let token = generateToken(user);
    res.cookie("token", token, {
      maxAge: 5 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    

    res.status(STATUS_CODES.SUCCESS).json({
      statusCode: STATUS_CODES.SUCCESS,
      message: TEXTS.LOGIN,
      data:user
    });
  
});

const logout = asyncErrorHandler(async (req, res) => {

    res.cookie("token","",{
      maxAge:0
    })
  
    res.status(STATUS_CODES.SUCCESS).json({
      statusCode: STATUS_CODES.SUCCESS,
      message: TEXTS.LOGOUT
    });
  
});


module.exports = {
  signup,
  login,
  logout
};
