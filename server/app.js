require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const { unless } = require("express-unless");
const routes = require("./routes");
// const { authenticateRoutes } = require("./config/unlessRoutes");
// const { authenticate } = require("./middlewares/auth.middleware");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error/errorController");
const connectCloudinary=require('./config/cloudinary')
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
connectCloudinary()

// const {upload}= require('./utils/multer');

// const {uploadFile} = require('./utils/aws')

app.get("/test",(req,res)=>{
  res.send("Server is running changes")
})

// authenticate.unless = unless;
// app.use(authenticate.unless(authenticateRoutes));

app.use(require('./middlewares/paginate').paginate)

app.use(routes);

// app.post('/upload-file',upload.single('file'),async(req,res)=>{

//   try{

//     const data = await uploadFile(req.file)

//     res.status(200).json(data);

//   }catch(err){
//     console.log("error : ",err)
//   }
// })

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
