const router = require("express").Router();
const {
  addInitiative,
  removeInitiative,
  updateInitiativeWithScore,
  getInitiatives,
  getStaffInitiatives,
} = require("../controllers/initiative.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/add", verifyToken, addInitiative); //staff add initiative
router.patch("/add/:id", verifyToken, updateInitiativeWithScore); //add score to initiative

router.get("/", verifyToken, getInitiatives); //staff initiatives
router.get("/:id", verifyToken, getStaffInitiatives); //manager get single staff initiatives

router.delete("/remove/:id", verifyToken, removeInitiative);

module.exports = router;
