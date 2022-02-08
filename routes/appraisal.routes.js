const router = require("express").Router();
const {
  createAppraisal,
  startAppraisal,
  getCurrentAppraisal,
  getAllAppraisal,
  getAppraisal,
  updateAppraisal,
  deleteAppraisal,
} = require("../controllers/appraisal.controllers");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", createAppraisal); // create an appraisal
router.get("/", getAllAppraisal); // get all appraisal
router.get("/current", getCurrentAppraisal); // get currently started appraisal
router.get("/:id", getAppraisal); // get appraisal by id
router.patch("/:id", verifyToken, updateAppraisal); // update appraisal by id
router.delete("/:id", verifyToken, deleteAppraisal); // deleteAppraisal by id
router.patch("/start/:id", verifyToken, startAppraisal); // start appraisal using id

module.exports = router;
