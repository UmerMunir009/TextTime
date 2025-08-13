const router = require("express").Router();
const groupServices = require("../../services/group/index");
const {upload}=require('../../utils/multer')


router.post("/create-group", groupServices.createGroup); 
router.get("/get-groups", groupServices.getGroups); 
router.get("/get-group-members/:id", groupServices.getMembers); 
router.put('/update-groupinfo/:id',upload.single('image'),groupServices.updateGroupInfo)
router.post("/group/send/:id",upload.single('image'), groupServices.sendMessage); 
router.get("/group/chat/:id", groupServices.getChat); 
router.post("/group/add-member/:id", groupServices.addMember); 




module.exports = router;

