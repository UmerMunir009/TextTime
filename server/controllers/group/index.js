const router = require("express").Router();
const groupServices = require("../../services/group/index");
const {upload}=require('../../utils/multer')


router.post("/create-group", groupServices.createGroup); 
router.get("/get-groups", groupServices.getGroups); 
router.get("/get-group-members/:id", groupServices.getMembers); 
router.put('/update-groupinfo/:id',upload.single('image'),groupServices.updateGroupInfo)




module.exports = router;

