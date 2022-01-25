const router = require("express").Router();
const upload = require("../config/multersetup");
const {
  postUserDetails,
  updateUser,
  uploadDp,
  getAllStaff,
  deleteStaff,
} = require("../controllers/auth.controllers");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/", postUserDetails); //register a new user

router.put("/", verifyToken, updateUser); //update a user

router.delete("/", verifyToken, deleteStaff); //delete a user

router.patch("/userdp", verifyToken, upload.single("profilePic"), uploadDp); //upload profile picture

router.get("/allstaff", verifyToken, getAllStaff); //get all staff"

module.exports = router;
