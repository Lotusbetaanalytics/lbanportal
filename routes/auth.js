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
  getUserDP,
  makeManager,
} = require("../controllers/auth");
const { verifyToken, verifyTokenAdmin } = require("../middlewares/auth");

router.post("/", postUserDetails); //register a new user
router.get("/", verifyToken, getUser); //get authenticated user
router.patch("/", verifyToken, updateUser); //update a user

router.patch("/userdp", verifyToken, uploadDp);
router.get("/photo", verifyToken, getUserDP); //get staff profile picture

router.patch(
  "/documents",
  verifyToken,
  upload.array("documents", 5),
  uploadDocuments
); //upload documents

router.patch("/manager/:id", verifyToken, makeManager); //make staff a manager

//Admin routes
router.get("/allstaff", getAllStaff); //get all staff"
router.delete("/:id", verifyTokenAdmin, deleteStaff); //delete a user

module.exports = router;
