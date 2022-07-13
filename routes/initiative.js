const router = require("express").Router();
const {
  addInitiative,
  removeInitiative,
  getInitiatives,
  getStaffInitiatives,
  getInitiativeByStaffId,
  editInitiative,
} = require("../controllers/initiative");
const { verifyToken } = require("../middlewares/auth");

router.post("/", verifyToken, addInitiative); //staff add initiative
router.get("/", verifyToken, getInitiatives); //staff initiatives
router.get("/:id", verifyToken, getStaffInitiatives); //manager get single staff initiatives
router.patch("/:id", verifyToken, editInitiative); //edit initiative

router.delete("/:id", verifyToken, removeInitiative); //
router.get("/staff/:id", verifyToken, getInitiativeByStaffId); // get initiatives for a staff by staff id

module.exports = router;
