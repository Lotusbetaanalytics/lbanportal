const router = require("express").Router();
const {
  createCalibration,
  getAllCalibration,
  getCurrentCalibration,
  getCurrentCalibrationByStaffId,
  getCalibration,
  updateCalibration,
  deleteCalibration,
} = require("../controllers/calibration");
const {
  verifyToken,
  verifyTokenAdmin,
  verifyTokenHR,
} = require("../middlewares/auth");

router.post("/", verifyTokenHR, createCalibration); // create a calibration
router.get("/", verifyToken, getAllCalibration); // get all calibrations
router.get("/current", verifyToken, getCurrentCalibration); // get current calibration for autheticated user
router.get("/:id", verifyToken, getCalibration); // get calibration details by id
router.patch("/:id", verifyTokenHR, updateCalibration); // update calibration details by id
router.delete("/:id", verifyTokenHR, deleteCalibration); // delete calibration by id
router.get("/staff/:id", verifyTokenHR, getCurrentCalibrationByStaffId); // get current calibration using user id

module.exports = router;
