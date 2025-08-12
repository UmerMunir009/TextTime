const router = require("express").Router();
const groupServices = require("../../services/group/index");


router.post("/create-group", groupServices.createGroup); 
router.get("/get-groups", groupServices.getGroups); 
router.get("/get-group-members/:id", groupServices.getMembers); 



module.exports = router;

