const router = require("express").Router();
const upload = require("../config/multersetup");
const {
  postUserDetails,
  updateUser,
  uploadDp,
  getAllStaff,
  deleteStaff,
} = require("../controllers/auth.controllers");
const {
  verifyToken,
  verifyTokenAdmin,
} = require("../middlewares/auth.middleware");

router.post("/", postUserDetails); //register a new user

router.patch("/", verifyToken, updateUser); //update a user

router.patch("/userdp", verifyToken, upload.single("profilePic"), uploadDp); //upload profile picture

//Admin routes
router.get("/allstaff", verifyTokenAdmin, getAllStaff); //get all staff"
router.delete("/:id", verifyTokenAdmin, deleteStaff); //delete a user

module.exports = router;
