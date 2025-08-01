const router = require("express").Router();
const {validate}=require('./../../middlewares/validator')
// const  {userCreateSchema}= require('./../../middlewares/usersSchema')
const messageServices = require("../../services/message/index");
const {upload}=require('../../utils/multer')


router.get("/users", messageServices.getAllUsers); 
router.get("/:id", messageServices.getChat); 
router.post("/send/:id", messageServices.sendMessage); 
// router.post("/auth/login", authServices.login); 
// router.post("/auth/logout", authServices.logout); 
// router.put('/auth/update-profile',upload.single('image'),authServices.updateProfile)
// router.get('/auth/checkAuth',authServices.checkAuth)




module.exports = router;

