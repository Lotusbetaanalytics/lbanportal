const Appraisal = require("../models/Appraisal");
const Log = require("../models/Log");
const { ErrorResponseJSON } = require("../utils/errorResponse");

// Create an appraisal
const createAppraisal = async (req, res) => {
  try {
    const findAppraisal = await Appraisal.findOne({
      // status: "Started",
      quarter: req.body.quarter,
      session: req.body.session,
    });

    if (findAppraisal) {
      return new ErrorResponseJSON(
        res,
        "Appraisal already running for this quarter",
        400
      );
    }

    const appraisal = await Appraisal.create(req.body);
    await Log.create({
      title: "Appraisal Session created",
      description: `An Appraisal Session has been created for the ${appraisal.quarter} of the ${appraisal.session} session`,
    });

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Start an appraisal by ID
const startAppraisal = async (req, res) => {
  try {
    const startedAppraisal = await Appraisal.find({ status: "Started" });
    if (startedAppraisal.length > 0) {
      return new ErrorResponseJSON(
        res,
        "An Appraisal has been started previously, stop it before starting a new one",
        400
      );
    }
    const appraisal = await Appraisal.findByIdAndUpdate(
      req.params.id,
      { status: "Started" },
      {
        new: true,
        runValidators: true,
      }
    );
    await Log.create({
      title: "Appraisal Session started",
      description: `An Appraisal Session has been started for the ${appraisal.quarter} of the ${appraisal.session} session`,
    });

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get current appraisal
const getCurrentAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({ status: "Started" });
    if (!appraisal) {
      return new ErrorResponseJSON(res, "Appraisal not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get all appraisals
const getAllAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.find({});
    if (!appraisal || appraisal.length < 1) {
      return new ErrorResponseJSON(res, "Appraisals not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get an appraisal by ID
const getAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findById(req.params.id);
    if (!appraisal) {
      return new ErrorResponseJSON(res, "Appraisal not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Upadate an appraisal's details
const updateAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    await Log.create({
      title: "Appraisal Session updated",
      description: `An Appraisal Session has been updated for the ${appraisal.quarter} of the ${appraisal.session} session`,
    });

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Delete an appraisal
const deleteAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findByIdAndDelete(req.params.id);
    if (!appraisal) {
      return new ErrorResponseJSON(res, "Appraisal not found!", 404);
    }

    await Log.create({
      title: "Appraisal Session Deleted",
      description: `An Appraisal Session has been deleted for the ${appraisal.quarter} of the ${appraisal.session} session`,
    });

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

module.exports = {
  createAppraisal,
  startAppraisal,
  getCurrentAppraisal,
  getAllAppraisal,
  getAppraisal,
  updateAppraisal,
  deleteAppraisal,
};
