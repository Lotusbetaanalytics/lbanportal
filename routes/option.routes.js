const router = require('express').Router()
const {
  createOption,
  getAllOptions,
  getOption,
  updateOption,
  deleteOption
} = require("../controllers/option.controllers")
const { verifyToken } = require("../middlewares/auth.middleware")

router.post("/", verifyToken, createOption); // create a option
router.get("/", getAllOptions); // get all options
router.get("/:id", verifyToken, getOption); // get option details by id
router.patch("/:id", verifyToken, updateOption); // update option details by id
router.delete("/:id", verifyToken, deleteOption); // delete option by id

module.exports = router;