const router = require("express").Router();
const {getLogs} = require("../controllers/logs");
const {verifyToken} = require("../middlewares/auth");

router.get("/", getLogs); // create section a result

module.exports = router;
