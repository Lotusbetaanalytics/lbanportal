const router = require('express').Router()
const {
  createPerspective,
  getAllPerspectives,
  getPerspective,
  updatePerspective,
  deletePerspective
} = require("../controllers/perspective.controllers")
const { verifyToken } = require("../middlewares/auth.middleware")

router.post("/", verifyToken, createPerspective); // create a perspective
router.get("/", getAllPerspectives); // get all perspectives
router.get("/:id", verifyToken, getPerspective); // get perspective details by id
router.patch("/:id", verifyToken, updatePerspective); // update perspective details by id
router.delete("/:id", verifyToken, deletePerspective); // delete perspective by id

module.exports = router;