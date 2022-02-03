const router = require('express').Router();
const {
  createAppraisalA,
  getAppraisalA,
  // getAllAppraisalA,
  updateAppraisalA,
  deleteAppraisalA
} = require('../controllers/appraisalA.controllers');
const verifyToken = require("../middlewares/auth.middleware");

router.post("/", createAppraisalA); // create an appraisalA

router.get("/", getAppraisalA); // get all appraisalA

// router.get("/current", getAllAppraisalA); // get appraisalA

router.patch("/:id", verifyToken, updateAppraisalA); // update appraisalA

router.delete("/:id", verifyToken, deleteAppraisalA); // delete appraisalA

module.exports = router;