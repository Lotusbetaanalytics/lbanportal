const Result = require("../models/Result");
const Report = require("../models/Report");
const { ErrorResponseJSON, ErrorResponse } = require("../utils/errorResponse");
const Log = require("../models/Log");
const current = require("../utils/currentAppraisalDetails");
const Staff = require("../models/Staff");
const asyncHandler = require("../middlewares/asyncHandler");

const getReports = async (req, res) => {
  try {
    const reports = await Report.find({});

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500));
  }
};

const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return next(new ErrorResponseJSON(res, "Report not found", 404));
    }
    const newReport = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const { currentSession, currentQuarter } = await current();
    const hr = await Staff.findById(user);

    const staff = await Staff.findById(req.user);

    // Send email to staff, manager and hr
    try {
      let salutation = ``;
      let content = `
      Kindly be aware that the calibration for ${staff.fullname}, for the ${currentSession} session,  has been updated. The calibrated score is ${newReport.calibration}.
      `;
      await sendEmail({
        email: staff.email,
        cc: [hr.email, staff.manager.email],
        subject: "Updated Appraisal Calibration",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err);
    }

    await Log.create({
      title: "Staff score calibrated!",
      description: `Staff score has been calibrated by ${staff.fullname} for the ${currentQuarter} of the ${currentSession} session`,
    });

    return res.status(200).json({
      success: true,
      data: newReport,
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500));
  }
};
const getStaffReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({ staff: req.user });
    if (!report) {
      return next(new ErrorResponseJSON(res, "Report not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500));
  }
};

module.exports = {
  getReports,
  updateReport,
  getStaffReport,
};
