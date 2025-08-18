const router = require("express").Router();
const groupServices = require("../../services/group/index");
const {upload}=require('../../utils/multer')


router.post("/groups", groupServices.createGroup);
router.get("/groups", groupServices.getGroups); 
router.get("/groups/:id/members", groupServices.getMembers);
router.put("/groups/:id", upload.single("image"), groupServices.updateGroupInfo);
router.post("/groups/:id/messages", upload.single("image"), groupServices.sendMessage);
router.get("/groups/:id/messages", groupServices.getChat);
router.post("/groups/:id/members", groupServices.addMember);
router.delete("/groups/:id/members", groupServices.removeMember);


module.exports = router;

