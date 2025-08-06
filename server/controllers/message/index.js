const router = require("express").Router();
const messageServices = require("../../services/message/index");
const {upload}=require('../../utils/multer')


router.get("/users", messageServices.getAllUsers); 
router.get("/:id", messageServices.getChat); 
router.post("/send/:id",upload.single('image'), messageServices.sendMessage); 


module.exports = router;

