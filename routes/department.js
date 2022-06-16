const {
  getDepartments,
  createDepartment,
  removeDepartment,
  updateDepartment,
} = require("../controllers/department");
const { verifyToken } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/", getDepartments);
router.post("/", verifyToken, createDepartment);
router.delete("/:id", verifyToken, removeDepartment);
router.put("/:id", verifyToken, updateDepartment);

module.exports = router;
