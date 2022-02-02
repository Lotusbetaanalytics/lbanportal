const AppraisalA = require("../models/AppraisalA")

//Create an appraisal
const createAppraisalA = async (req, res) => {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }
    const appraisal = await AppraisalA.create(req.body);

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

//Get all appraisalAs
const getAllAppraisalA = async (req, res) => {
  try {
    const appraisalA = await AppraisalA.find({});
    if (!appraisalA) {
      return res
        .status(400)
        .json({ success: false, msg: "AppraisalAs not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: appraisalA,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get appraisalA by ID
const getAppraisalA = async (req, res) => {
  try {
    const appraisalA = await AppraisalA.findById(req.params.id);
    if (!appraisalA) {
      return res
        .status(400)
        .json({ success: false, msg: "AppraisalAs not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: appraisalA,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Upadate an appraisalA's details using ID
const updateAppraisalA = async (req, res) => {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }
    const appraisalA = await AppraisalA.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: appraisalA,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Delete an appraisalA using ID
const deleteAppraisalA = async (req, res) => {
  try {
    const appraisalA = await AppraisalA.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!appraisalA) {
      return res
        .status(400)
        .json({ success: false, msg: "AppraisalA not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: appraisalA,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createAppraisalA,
  getAppraisalA,
  getAllAppraisalA,
  updateAppraisalA,
  deleteAppraisalA
}