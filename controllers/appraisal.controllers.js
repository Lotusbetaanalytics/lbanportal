const Appraisal = require("../models/Appraisal")

//Create an appraisal
const createAppraisal = async (req, res) => {
  try {
    const { user, body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }
    const appraisal = await Appraisal.create(req.body);

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Start an appraisal by ID
const startAppraisal = async (req, res) => {
  try {
    const startedAppraisal = await Appraisal.find({ status: "Started" });
    if (startedAppraisal.length > 0) {
      return res
        .status(400)
        .json({ success: false, msg: "An Appraisal has been started previously, stop to start a new one" });
    }
    const appraisal = await Appraisal.findByIdAndUpdate(
      req.params.appraisal_id,
      {status: "Started"},
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get current appraisal
const getCurrentAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({ status: "Started" });
    if (!appraisal) {
      return res
        .status(400)
        .json({ success: false, msg: "Appraisal not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all appraisals
const getAllAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.find({});
    if (!appraisal) {
      return res
        .status(400)
        .json({ success: false, msg: "Appraisals not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Upadate an appraisal's details
const updateAppraisal = async (req, res) => {
  try {
    const { user, body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }
    const appraisal = await Appraisal.findByIdAndUpdate(req.params.appraisal_id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Delete an appraisal
const deleteAppraisal = async (req, res) => {
  try {
    const appraisal = await Appraisal.findByIdAndUpdate(req.params.appraisal_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!appraisal) {
      return res
        .status(400)
        .json({ success: false, msg: "Appraisal not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: appraisal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createAppraisal,
  startAppraisal,
  getCurrentAppraisal,
  getAllAppraisal,
  updateAppraisal,
  deleteAppraisal
}