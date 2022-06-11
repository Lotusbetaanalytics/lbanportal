const { getReports, updateReport } = require("../controllers/report");
const { verifyToken } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/", getReports);
router.patch("/:id", verifyToken, updateReport);

module.exports = router;
