const router = require("express").Router();

router.use(require('../controllers/auth/index.js'));
router.use(require('../controllers/group/index.js'));
router.use(require('../controllers/message/index.js'))
router.use(require('../controllers/friend/index.js'))


module.exports = router;
