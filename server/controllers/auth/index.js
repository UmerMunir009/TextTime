const router = require("express").Router();
const {validate}=require('./../../middlewares/validator')
const  {userCreateSchema}= require('./../../middlewares/usersSchema')
const authServices = require("../../services/auth/index");
const {upload}=require('../../utils/multer')


router.post("/auth/sign-up",validate(userCreateSchema), authServices.signup); 
router.post("/auth/login", authServices.login); 
router.post("/auth/logout", authServices.logout); 
// router.post("/auth/sign-in", authServices.login); 
// router.post("/auth/logout", authServices.login); 



module.exports = router;

// ,upload.single('image')