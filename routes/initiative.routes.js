const router = require("express").Router();
const {
  addInitiative,
  removeInitiative,
} = require("../controllers/initiative.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/add", verifyToken, addInitiative);

router.delete("/remove", verifyToken, removeInitiative);

module.exports = router;
