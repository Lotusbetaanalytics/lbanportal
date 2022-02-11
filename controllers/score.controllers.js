const Score = require("../models/Score")
const current = require("../utils/currentAppraisalDetails");

//Create a score
const createScore = async (req, res) => {
  const {currentSession, currentQuarter} = await current()

  try {
    let { user, body } = req;
    const {session, quarter} = body

    if (!session || !quarter) {
      body.session = currentSession
      body.quarter = currentQuarter
    }
    body.user = user

    const findScore = await Score.find({
      user: user,
      question: body.question,
      session: body.session,
      quarter: body.quarter,
    });

    if (findScore.length > 0) {
      const updateScore = await Score.findByIdAndUpdate(score[0]._id, body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        success: true,
        data: updateScore,
      });
    } else {
      const score = await Score.create(body);

      res.status(200).json({
        success: true,
        data: score,
      });
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all scores
const getAllScores = async (req, res) => {
  try {
    const score = await Score.find({}).populate("user question");
    if (!score) {
      return res
        .status(404)
        .json({ success: false, msg: "Scores not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get the current scores for authenticated user
const getCurrentUserScores = async (req, res) => {
  try {
    const {currentSession, currentQuarter} = await current()

    const score = await Score.find({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    }).populate("question");

    if (!score) {
      return res
        .status(400)
        .json({ success: false, msg: "Scores not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all scores for authenticated user
const getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({user: req.user}).populate("question");
    
    res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get a score's details
const getScore = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id).populate("user question");
    if (!score) {
      return res
        .status(404)
        .json({ success: false, msg: "Score not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Upadate a score's details
const updateScore = async (req, res) => {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }
    const score = await Score.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Delete a score
const deleteScore = async (req, res) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);
    if (!score) {
      return res
        .status(404)
        .json({ success: false, msg: "Score not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createScore,
  getAllScores,
  getCurrentUserScores,
  getUserScores,
  getScore,
  updateScore,
  deleteScore
}