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

router.get("/current", getCurrentAppraisal); // get current appraisal

router.get("/:id", getAppraisal); // get appraisal by ID

router.patch("/:id", verifyToken, updateAppraisal); // update appraisal

router.delete("/:id", verifyToken, deleteAppraisal); // deleteAppraisal

router.patch("/start/:id", verifyToken, startAppraisal); // start appraisal

module.exports = router;
