const Result = require("../models/Result")
const Appraisal = require("../models/Appraisal")
const current = require("../utils/currentAppraisalDetails")

//Create a result
const createResult = async (req, res) => {
  const {currentSession, currentQuarter} = await current()

  try {
    let { user, body } = req;
    const {session, quarter} = body

    if (!session || !quarter)
      body.user = user
      body.session = currentSession
      body.quarter = currentQuarter

    const result = await Result.create(body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all results
const getAllResult = async (req, res) => {
  try {
    const result = await Result.find({});
    if (!result) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};


//Get the current appraisal result for a staff
const getCurrentResult = async (req, res) => {
  try {
    const {currentSession, currentQuarter} = await current()

    const result = await Result.findOne({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    });
    if (!result) {
      return res
        .status(400)
        .json({ success: false, msg: "Result not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all results by quarter
const getQuarterlyResult = async (req, res) => {
  try {
    const {currentSession} = await current()

    const firstQuarterResult = await Result.find({
      user: req.user,
      session: currentSession,
      quarter: "First Quarter",
    });
    const secondQuarterResult = await Result.find({
      user: req.user,
      session: currentSession,
      quarter: "Second Quarter",
    });
    const thirdQuarterResult = await Result.find({
      user: req.user,
      session: currentSession,
      quarter: "Third Quarter",
    });
    const fourthQuarterResult = await Result.find({
      user: req.user,
      session: currentSession,
      quarter: "Fourth Quarter",
    });
    if (!firstQuarterResult || !secondQuarterResult || !thirdQuarterResult || !fourthQuarterResult) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: {
        firstQuarter: firstQuarterResult,
        secondQuarter: secondQuarterResult,
        thirdQuarter: thirdQuarterResult,
        fourthQuarter: fourthQuarterResult,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get a result's details
const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, msg: "Result not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Upadate a result's details
const updateResult = async (req, res) => {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }
    const result = await Result.findByIdAndUpdate(req.params.result_id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Delete a result
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.result_id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, msg: "Result not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createResult,
  getAllResult,
  getCurrentResult,
  getQuarterlyResult,
  getResult,
  updateResult,
  deleteResult
}