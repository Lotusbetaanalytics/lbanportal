const router = require('express').Router();
const {
  createAppraisalA,
  getAllAppraisalA,
  getAppraisalA,
  updateAppraisalA,
  deleteAppraisalA
} = require('../controllers/appraisalA.controllers');
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", createAppraisalA); // create an appraisalA

router.get("/all", getAllAppraisalA); // get appraisalA

router.get("/:id", getAppraisalA); // get all appraisalA

router.patch("/:id", verifyToken, updateAppraisalA); // update appraisalA

router.delete("/:id", verifyToken, deleteAppraisalA); // delete appraisalA

module.exports = router;