const router = require("express").Router();
const {validate}=require('./../../middlewares/validator')
const messageServices = require("../../services/message/index");
const {upload}=require('../../utils/multer')


router.get("/users", messageServices.getAllUsers); 
router.get("/:id", messageServices.getChat); 
router.post("/send/:id",upload.single('image'), messageServices.sendMessage); 
// router.post("/auth/login", authServices.login); 
// router.post("/auth/logout", authServices.logout); 
// router.put('/auth/update-profile',upload.single('image'),authServices.updateProfile)
// router.get('/auth/checkAuth',authServices.checkAuth)




module.exports = router;

