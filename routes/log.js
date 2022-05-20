const router = require("express").Router();
const {
  createLog,
  getAllLogs,
  getLog,
  updateLog,
  deleteLog,
} = require("../controllers/log");
const { verifyToken } = require("../middlewares/auth");

router.post("/", createLog); // create an log
router.get("/", getAllLogs); // get all logs
router.get("/:id", getLog); // get log details by id
router.patch("/:id", verifyToken, updateLog); // update log by id
router.delete("/:id", verifyToken, deleteLog); // delete log by id

module.exports = router;
