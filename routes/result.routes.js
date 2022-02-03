const router = require('express').Router()
const {
  createResult,
  // getAllResult,
  getCurrentResult,
  getQuarterlyResult,
  getResult,
  updateResult,
  deleteResult
} = require("../controllers/result.controllers")
const verifyToken = require("../middlewares/auth.middleware")

router.post("/", createResult); // create an result

// router.get("/", getAllResult); // get all results

router.get("/current/", getCurrentResult); // get current result

router.get("/quaterly/", getQuarterlyResult); // get current result

router.patch("/:id", verifyToken, getResult); // get result by id

router.patch("/:id", verifyToken, updateResult); // update result

router.delete("/:id", verifyToken, deleteResult); // delete result

module.exports = router;