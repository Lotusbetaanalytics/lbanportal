const router = require("express").Router();
const upload = require("../config/multersetup");
const {
  postUserDetails,
  getUser,
  updateUser,
  uploadDp,
  getAllStaff,
  deleteStaff,
  uploadDocuments,
} = require("../controllers/auth.controllers");
const {
  verifyToken,
  verifyTokenAdmin,
} = require("../middlewares/auth.middleware");

router.post("/", postUserDetails); //register a new user
router.get("/", verifyToken, getUser); //get authenticated user
router.patch("/", verifyToken, updateUser); //update a user

router.patch("/userdp", verifyToken, upload.single("profilePic"), uploadDp); //upload profile picture

router.patch(
  "/documents",
  verifyToken,
  upload.array("documents", 5),
  uploadDocuments
); //upload documents

//Admin routes
router.get("/allstaff", verifyTokenAdmin, getAllStaff); //get all staff"
router.delete("/:id", verifyTokenAdmin, deleteStaff); //delete a user

module.exports = router;
