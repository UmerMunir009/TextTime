require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { unless } = require("express-unless");
const routes = require("./routes");
const { authenticateRoutes } = require("./config/unlessRoutes");
const { authenticate } = require("./middlewares/auth.middleware");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/error/errorController");
const connectCloudinary=require('./config/cloudinary')
const cookirParser=require('cookie-parser')
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Vite default dev server
  credentials: true                
}));
app.use(cookirParser())
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: false }));
connectCloudinary()

app.get("/",(req,res)=>{
  res.send("Server is running changes")
})

authenticate.unless = unless;   
app.use(authenticate.unless(authenticateRoutes));

app.use(require('./middlewares/paginate').paginate)

app.use(routes);

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
