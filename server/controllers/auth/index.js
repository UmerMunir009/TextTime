const router = require("express").Router();
const {validate}=require('./../../middlewares/validator')
const  {userCreateSchema}= require('./../../middlewares/usersSchema')
const authServices = require("../../services/auth/index");
const {upload}=require('../../utils/multer')


router.post("/auth/sign-up",validate(userCreateSchema), authServices.signup); 
router.post("/auth/login", authServices.login); 
router.post("/auth/logout", authServices.logout); 
router.put('/auth/update-profile',upload.single('image'),authServices.updateProfile)
router.get('/auth/checkAuth',authServices.checkAuth)




module.exports = router;

