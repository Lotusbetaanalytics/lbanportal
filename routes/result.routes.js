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

router.post("/", verifyToken, createResult); // create an result

router.get("/", getAllResult); // get all results

router.get("/current", verifyToken, getCurrentResult); // get current result

router.get("/quarterly", verifyToken, getQuarterlyResult); // get quarterly result

router.get("/:id", verifyToken, getResult); // get result by id

router.patch("/:id", verifyToken, updateResult); // update result

router.delete("/:id", verifyToken, deleteResult); // delete result

module.exports = router;