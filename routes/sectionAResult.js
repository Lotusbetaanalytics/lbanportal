const router = require("express").Router();
const {createSectionAResult, getSectionAResult} = require("../controllers/sectionAResult");
const {verifyToken} = require("../middlewares/auth");

router.post("/", verifyToken, createSectionAResult); // create section a result
router.get("/", verifyToken, getSectionAResult); // get section a result for authenticated staff

module.exports = router;
