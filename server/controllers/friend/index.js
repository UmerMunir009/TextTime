const router = require("express").Router();
const friendServices = require("../../services/friend/index");


router.post("/add-new-friend", friendServices.addFriend); 



module.exports = router;

