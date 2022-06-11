const Result = require("../models/Result");
const Report = require("../models/Report");
const { ErrorResponseJSON, ErrorResponse } = require("../utils/errorResponse");

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

    return res.status(200).json({
      success: true,
      data: newReport,
    });
  } catch (err) {
    return next(new ErrorResponseJSON(res, err.message, 500));
  }
};

module.exports = {
  getReports,
  updateReport,
};
