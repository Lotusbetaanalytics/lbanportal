const router = require("express").Router();
const {
  createAppraisalA,
  getAllAppraisalA,
  getAppraisalA,
  updateAppraisalA,
  deleteAppraisalA,
} = require("../controllers/appraisalA");
const { verifyToken } = require("../middlewares/auth");

router.post("/", createAppraisalA); // create an appraisalA
router.get("/", getAllAppraisalA); // get all appraisalAs
// router.get("/:id", getAppraisalA); // get appraisalA details by id
router.patch("/:id", verifyToken, updateAppraisalA); // update appraisalA by id
router.delete("/:id", verifyToken, deleteAppraisalA); // delete appraisalA by id

module.exports = router;
