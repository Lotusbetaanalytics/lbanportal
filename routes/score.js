const router = require("express").Router();
const {
  createScore,
  getAllScores,
  getCurrentUserScores,
  getCurrentUserScoresByQuestionId,
  getUserScores,
  getScoresByUserId,
  getScoreByUserIdAndQuestionId,
  updateScoreByUserIdAndQuestionId,
  getScore,
  updateScore,
  deleteScore,
} = require("../controllers/score");
const { verifyToken } = require("../middlewares/auth");

router.post("/", verifyToken, createScore); // create a score
router.get("/", getAllScores); // get all scores
router.get("/current", verifyToken, getCurrentUserScores); // get current score for autheticated user
router.get("/all", verifyToken, getUserScores); // get quarterly score for authenticated user
router.get("/:id", verifyToken, getScore); // get score details by id
router.patch("/:id", verifyToken, updateScore); // update score details by id
router.delete("/:id", deleteScore); // delete score by id
router.get("/question/:id", verifyToken, getCurrentUserScoresByQuestionId); // get current score for autheticated user
router.get("/staff/:id", verifyToken, getScoresByUserId); // get scores for a staff by staff id
router.get("/staff/:id/:q_id", verifyToken, getScoreByUserIdAndQuestionId); // get a score for a staff by staff id and question
router.patch("/staff/:id/:q_id", verifyToken, updateScoreByUserIdAndQuestionId); // update a score for a staff by staff id and question

module.exports = router;
