const Calibration = require("../models/Calibration");
const Result = require("../models/Result");
const Staff = require("../models/Staff");
const current = require("../utils/currentAppraisalDetails");
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a calibration
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
      return new ErrorResponseJSON(res, "Calibration already exists", 400)
    }

    if (!session) {
      body.session = currentSession
    }
    body.hr = user

    const calibration = await Calibration.create(body);
    const hr = await Staff.findById(user)
    const staff = await Staff.findById(calibration.staff).populate("manager")

    // Send email to staff, manager and hr
    try {
      let salutation = ``
      let content = `
      Kindly be aware that the calibration for ${staff.fullname}, for the ${currentSession} session,  has been completed. The calibrated score is ${calibration.score}.
      `
      await sendEmail({
        email: staff.email,
        cc: [hr.email, staff.manager.email],
        subject: "Completed Appraisal Calibration",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err)
    }
    
    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get all results
const getAllCalibration = async (req, res) => {
  try {
    const calibration = await Calibration.find().populate({
      path: "hr",
      select: "fullname email department manager role isManager"
    }).populate({
      path: "staff",
      select: "fullname email department manager role isManager"
    });

    if (!calibration || calibration.length < 1) {
      return new ErrorResponseJSON(res, "Calibrations not found!", 404)
    }

    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get the current appraisal calibration for authenticated staff
const getCurrentCalibration = async (req, res) => {
  try {
    const {currentSession} = await current()

    const calibration = await Calibration.findOne({
      staff: req.user,
      session: currentSession
    }).populate({
      path: "hr",
      select: "fullname email department manager role isManager"
    }).populate({
      path: "staff",
      select: "fullname email department manager role isManager"
    });

    if (!calibration) {
      return new ErrorResponseJSON(res, "Calibration not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get the current appraisal calibration for a staff
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

    // if (!firstQuarterResult || !secondQuarterResult || !thirdQuarterResult || !fourthQuarterResult) {
    //   return new ErrorResponseJSON(res, "There are no results to be calibrated!", 404)
    // }

    const calibration = await Calibration.findOne({
      staff: req.params.id,
      session: currentSession
    }).populate({
      path: "hr",
      select: "fullname email department manager role isManager"
    }).populate({
      path: "staff",
      select: "fullname email department manager role isManager"
    });

    if (!calibration) {
      return new ErrorResponseJSON(res, "Calibration not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: {
        staff: staff,
        calibration: calibration,
        firstQuarter: firstQuarterResult,
        secondQuarter: secondQuarterResult,
        thirdQuarter: thirdQuarterResult,
        fourthQuarter: fourthQuarterResult,
      },
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get a calibration's details
const getCalibration = async (req, res) => {
  try {
    const calibration = await Calibration.findById(req.params.id).populate({
      path: "hr",
      select: "fullname email department manager role isManager"
    }).populate({
      path: "staff",
      select: "fullname email department manager role isManager"
    });

    if (!calibration) {
      return new ErrorResponseJSON(res, "Calibration not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Upadate a calibration's details
const updateCalibration = async (req, res) => {
  try {
    const calibration = await Calibration.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const hr = await Staff.findById(user)
    const staff = await Staff.findById(calibration.staff).populate("manager")

    // Send email to staff, manager and hr
    try {
      let salutation = ``
      let content = `
      Kindly be aware that the calibration for ${staff.fullname}, for the ${currentSession} session,  has been updated. The calibrated score is ${calibration.score}.
      `
      await sendEmail({
        email: staff.email,
        cc: [hr.email, staff.manager.email],
        subject: "Updated Appraisal Calibration",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err)
    }

    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Delete a calibration
const deleteCalibration = async (req, res) => {
  try {
    const calibration = await Calibration.findByIdAndDelete(req.params.id);
    if (!calibration) {
      return new ErrorResponseJSON(res, "Calibration not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: calibration,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
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