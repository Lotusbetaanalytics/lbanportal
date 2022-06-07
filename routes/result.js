const router = require("express").Router();
const {
  createResult,
  getAllResult,
  getCurrentResult,
  updateCurrentResult,
  getQuarterlyResult,
  getCurrentResultByStaffId,
  UpdateCurrentResultByStaffId,
  rejectCurrentManagerScore,
  acceptCurrentManagerScore,
  getResult,
  updateResult,
  deleteResult,
} = require("../controllers/result");
const { verifyToken, verifyTokenAdmin } = require("../middlewares/auth");

router.post("/", verifyToken, createResult); // create a result
router.get("/", verifyToken, getAllResult); // get all results
router.get("/current", verifyToken, getCurrentResult); // get current result for autheticated user
router.patch("/current", verifyToken, updateCurrentResult); // update current result for autheticated user
router.get("/quarterly", verifyToken, getQuarterlyResult); // get quarterly result for authenticated user
router.patch("/reject", verifyToken, rejectCurrentManagerScore); // reject current result's manager's score for authenticated user
router.patch("/accept", verifyToken, acceptCurrentManagerScore); // accept current result's manager's score for authenticated user
router.get("/:id", verifyToken, getResult); // get result details by id
router.patch("/:id", verifyToken, updateResult); // update result details by id
router.delete("/:id", verifyToken, deleteResult); // delete result by id
router.get("/staff/:id", getCurrentResultByStaffId); // get current result using user id
router.patch("/staff/:id", verifyTokenAdmin, UpdateCurrentResultByStaffId); // update current result using user id

module.exports = router;
