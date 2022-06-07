const Log = require("../models/Log");
const { ErrorResponseJSON } = require("../utils/errorResponse");

// Create an log
const createLog = async (req, res) => {
  try {
    const log = await Log.create(req.body);

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get all logs
const getAllLogs = async (req, res) => {
  try {
    const log = await Log.find({}).sort("-createdAt");
    // if (!log || log.length < 1) {
    //   return new ErrorResponseJSON(res, "Logs not found!", 404);
    // }

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get log by ID
const getLog = async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) {
      return new ErrorResponseJSON(res, "Log not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Upadate an log's details using ID
const updateLog = async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Delete an log using ID
const deleteLog = async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return new ErrorResponseJSON(res, "Log not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

module.exports = {
  createLog,
  getAllLogs,
  getLog,
  updateLog,
  deleteLog,
};
