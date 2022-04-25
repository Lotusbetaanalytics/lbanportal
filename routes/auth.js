const router = require("express").Router();
const upload = require("../config/multersetup");
const {
  postUserDetails,
  getUser,
  updateUser,
  uploadDp,
  getAllStaff,
  getStaffByID,
  updateStaffByID,
  deleteStaff,
  uploadDocuments,
  getUserDP,
} = require("../controllers/auth");
const { verifyToken, verifyTokenAdmin } = require("../middlewares/auth");

router.post("/", postUserDetails); //register a new user
router.get("/", verifyToken, getUser); //get authenticated user
router.patch("/", verifyToken, updateUser); //update a user

router.get("/:id", getStaffByID); //get a user
router.patch("/:id", updateStaffByID); //update a user
router.delete("/:id", deleteStaff); //delete a user

router.patch("/userdp", verifyToken, upload.single("profilePic"), uploadDp);
router.get("/photo", verifyToken, getUserDP); //get staff profile picture

router.patch(
  "/documents",
  verifyToken,
  upload.array("documents", 5),
  uploadDocuments
); //upload documents

//Admin routes
router.get("/allstaff", getAllStaff); //get all staff"

module.exports = router;
