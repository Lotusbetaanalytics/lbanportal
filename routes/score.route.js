const router = require('express').Router()
const {
  createScore,
  getAllScores,
  getCurrentUserScores,
  getUserScores,
  getScore,
  updateScore,
  deleteScore
} = require("../controllers/score.controllers")
const { verifyToken } = require("../middlewares/auth.middleware")

router.post("/", verifyToken, createScore); // create a score
router.get("/", getAllScores); // get all scores
router.get("/current", verifyToken, getCurrentUserScores); // get current score for autheticated user
router.get("/all", verifyToken, getUserScores); // get quarterly score for authenticated user
router.get("/:id", verifyToken, getScore); // get score details by id
router.patch("/:id", verifyToken, updateScore); // update score details by id
router.delete("/:id", verifyToken, deleteScore); // delete score by id

module.exports = router;