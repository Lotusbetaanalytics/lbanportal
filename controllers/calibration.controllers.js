const Calibration = require("../models/Calibration");
const Result = require("../models/Result");
const Staff = require("../models/Staff");
const current = require("../utils/currentAppraisalDetails");

//Create a calibration
const createCalibration = async (req, res) => {
  const {currentSession} = await current()

  try {
    let { user, body } = req;
    const {session} = body

    const existingCalibration = await Calibration.find({
      staff: body.staff,
      session: currentSession
    });
    if (existingCalibration.length > 0) {
      res.status(200).json({
        success: true,
        msg: "Calibration already exists",
      });
    }

    if (!session) {
      body.session = currentSession
    }
    body.hr = user

    const calibration = await Calibration.create(body);

    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all results
const getAllCalibration = async (req, res) => {
  try {
    const calibration = await Calibration.find({}).populate("hr staff");
    if (!calibration) {
      return res
        .status(404)
        .json({ success: false, msg: "Calibrations not found!" });
    }

    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get the current appraisal calibration for authenticated staff
const getCurrentCalibration = async (req, res) => {
  try {
    const {currentSession} = await current()

    const calibration = await Calibration.findOne({
      staff: req.user,
      session: currentSession
    });
    if (!calibration) {
      return res
        .status(400)
        .json({ success: false, msg: "Calibration not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get the current appraisal calibration for a staff
const getCurrentCalibrationByStaffId = async (req, res) => {
  try {
    const {currentSession, currentQuarter} = await current()

    const staff = await Staff.findById(req.params.id)
    const firstQuarterResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: "First Quarter",
    });
    const secondQuarterResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: "Second Quarter",
    });
    const thirdQuarterResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: "Third Quarter",
    });
    const fourthQuarterResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: "Fourth Quarter",
    });

    if (!firstQuarterResult || !secondQuarterResult || !thirdQuarterResult || !fourthQuarterResult) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found!" });
    }

    const calibration = await Calibration.findOne({
      staff: req.params.id,
      session: currentSession
    });

    if (!calibration) {
      return res
        .status(400)
        .json({ success: false, msg: "Calibration not found!" });
    }
    
    res.status(200).json({
      success: true,
      staff: staff,
      result: {
        firstQuarter: firstQuarterResult,
        secondQuarter: secondQuarterResult,
        thirdQuarter: thirdQuarterResult,
        fourthQuarter: fourthQuarterResult,
      },
      data: calibration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get a calibration's details
const getCalibration = async (req, res) => {
  try {
    const calibration = await Calibration.findById(req.params.id).populate("hr staff");
    if (!calibration) {
      return res
        .status(404)
        .json({ success: false, msg: "Calibration not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Upadate a calibration's details
const updateCalibration = async (req, res) => {
  try {
    const calibration = await Calibration.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Delete a calibration
const deleteCalibration = async (req, res) => {
  try {
    const calibration = await Calibration.findByIdAndDelete(req.params.id);
    if (!calibration) {
      return res
        .status(404)
        .json({ success: false, msg: "Calibration not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createCalibration,
  getAllCalibration,
  getCurrentCalibration,
  getCurrentCalibrationByStaffId,
  getCalibration,
  updateCalibration,
  deleteCalibration
}