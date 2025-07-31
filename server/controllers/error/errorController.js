const CustomError = require("../../utils/CustomError");

const devErrors = (res, error) => {
  console.log("Error : =>",error)
  if(error.message === "Validation error"){
    let errorMessage = error?.errors[0]
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: errorMessage.message,
      stackTrace: error.stack,
      error: error,
    });
    return;

  }else{

     res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      stackTrace: error.stack,
      error: error,
    });
    return;
  }
 
};

const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new CustomError(msg, 400);
};

const duplicateKeyErrorHandler = (err) => {
  const name = err.keyValue.name;
  const msg = `There is already a movie with name ${name}. Please use another name!`;

  return new CustomError(msg, 400);
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new CustomError(msg, 400);
};

const constraintError = (err) =>{
  const name = "Database constraints error";
  const msg = "familyId not exist." ;

  return new CustomError(msg, 400);
}  

const  connectionRefusedError = (err) =>{
  const name = "Connection Refused Error";
  const msg = "Database connection failed, Please check your internet" ;

  return new CustomError(msg, 400);
}  

const  actualMessageId = (err) =>{
  const name = "Actual Message Id";
  const msg = "Please pass the valid message Id instead of messageId in params" ;

  return new CustomError(msg, 400);
}

const  actualFamilyId = (err) =>{
  const name = "Actual Family Id";
  const msg = "Please pass the valid family Id instead of familyId in params" ;

  return new CustomError(msg, 400);
}

const  actualId = (err) =>{
  const name = "Actual Id";
  const msg = `Please pass the valid  Id instead of Id in params` ;

  return new CustomError(msg, 400);
}   

// actual user id
const  actualUserId = (err) =>{
  const name = "Actual Message Id";
  const msg = "Please pass the valid user Id instead of userId in params" ;

  return new CustomError(msg, 400);
}

// invalid uuid format
const  invalidUUID = (err) =>{
  const name = "Actual Message Id";
  const msg = "Please pass the valid UUId" ;

  return new CustomError(msg, 400);
}

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error); 
    // console.log('error here .......', error);
  } else if (process.env.NODE_ENV === "production") { 
    // console.log('errrrrrror here..........', error.message);
    // console.log('error here.....', error.message.split(':')[0]);
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if(error.message === `insert or update on table "familyChats" violates foreign key constraint "familyChats_familyId_fkey"`) error= constraintError(error)
    if(error.message === `read ECONNRESET`) error  = connectionRefusedError(error)
    if(error.message === `invalid input syntax for type uuid: "messageId"`) error = actualMessageId(error) 
    if(error.message === `invalid input syntax for type uuid: "familyId"`) error = actualFamilyId(error) 
    if(error.message === `invalid input syntax for type uuid: "id"`) error = actualId(error) 
    if(error.message === `invalid input syntax for type uuid: "userId"`) error = actualUserId(error) 
    if(error.message.split(':')[0] === "invalid input syntax for type uuid") error = invalidUUID(error)


    prodErrors(res, error);
  }
};
