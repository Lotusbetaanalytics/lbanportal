const router = require('express').Router()
const {
  createResult,
  getAllResult,
  getCurrentResult,
  getQuarterlyResult,
  getResult,
  updateResult,
  deleteResult
} = require("../controllers/result.controllers")
const { verifyToken } = require("../middlewares/auth.middleware")

router.post("/", verifyToken, createResult); // create a result
router.get("/", getAllResult); // get all results
router.get("/current", verifyToken, getCurrentResult); // get current result for autheticated user
router.get("/quarterly", verifyToken, getQuarterlyResult); // get quarterly result for authenticated user
router.get("/:id", verifyToken, getResult); // get result details by id
router.patch("/:id", verifyToken, updateResult); // update result details by id
router.delete("/:id", verifyToken, deleteResult); // delete result by id

module.exports = router;