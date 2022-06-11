const {
  getReports,
  updateReport,
  getStaffReport,
} = require("../controllers/report");
const { verifyToken } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/", getReports);
router.patch("/:id", verifyToken, updateReport);
router.get("/staff/", verifyToken, getStaffReport);

module.exports = router;
