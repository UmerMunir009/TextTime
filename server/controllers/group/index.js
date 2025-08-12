const router = require("express").Router();
const groupServices = require("../../services/group/index");


router.post("/create-group", groupServices.createGroup); 
router.get("/get-groups", groupServices.getGroups); 



module.exports = router;

