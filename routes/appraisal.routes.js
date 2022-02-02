const router = require("express").Router();
const {
  createAppraisal,
  startAppraisal,
  getCurrentAppraisal,
  getAllAppraisal,
  updateAppraisal,
  deleteAppraisal
} = require("../controllers/appraisal.controllers");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/", createAppraisal); // create an appraisal

router.get("/", getAllAppraisal); // get all appraisal

router.get("/current", getCurrentAppraisal); // get current appraisal

router.patch("/:id", verifyToken, startAppraisal); // start appraisal

router.patch("/:id", verifyToken, updateAppraisal); // update appraisal

router.delete("/:id", verifyToken, deleteAppraisal); // deleteAppraisal

module.exports = router;