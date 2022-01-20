const router = require("express").Router();
const upload = require("../config/multersetup");
const {
  postUserDetails,
  updateUser,
  uploadDp,
} = require("../controllers/auth.controllers");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/", postUserDetails);

router.patch("/", verifyToken, updateUser);

router.post("/userdp", verifyToken, upload.single("profilePic"), uploadDp);

module.exports = router;
