const Score = require("../models/Score")
const Staff = require("../models/Staff")
const current = require("../utils/currentAppraisalDetails");

// Create a score
const createScore = async (req, res) => {
  try {
    let { user, body } = req;
    const {currentSession, currentQuarter} = await current()
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
      const updateScore = await Score.findByIdAndUpdate(findScore[0]._id, body, {
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
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get all scores
const getAllScores = async (req, res) => {
  try {
    const score = await Score.find({}).populate("question").populate({
      path: "user",
      select: "fullname email department manager role isManager"
    });
      
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
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get the current scores for authenticated user
const getCurrentUserScores = async (req, res) => {
  try {
    const {currentSession, currentQuarter} = await current()

    const score = await Score.find({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    }).populate("question").populate({
      path: "user",
      select: "fullname email department manager role isManager"
    });

    if (!score) {
      return new ErrorResponseJSON(res, "Scores not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get all scores for authenticated user
const getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({user: req.user}).populate("question").populate({
      path: "user",
      select: "fullname email department manager role isManager"
    });
    
    res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get current score for a question using the question id for an authenticated user
const getCurrentUserScoresByQuestionId = async (req, res) => {
  try {
    const {currentQuarter, currentSession} = await current()
      
    const scores = await Score.find({
      user: req.user,
      question: req.params.id,
      session: currentSession,
      quarter: currentQuarter,
    }).populate("question").populate({
      path: "user",
      select: "fullname email department manager role isManager"
    });
    
    if (scores.length < 1) {
      return new ErrorResponseJSON(res, "Staff's scores not found!", 404)
    }

    res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get all scores for a user using their id
const getScoresByUserId = async (req, res) => {
  try {
    const {currentQuarter, currentSession} = await current()

    const staff = await Staff.findById(req.params.id)
    const scores = await Score.find({
      user: req.params.id,
      session: currentSession,
      quarter: currentQuarter,
    }).populate("question").populate({
      path: "user",
      select: "fullname email department manager role isManager"
    });
    
    if (scores.length < 1) {
      return new ErrorResponseJSON(res, "Staff's scores not found!", 404)
    }

    res.status(200).json({
      success: true,
      staff: staff,
      data: scores,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get current score for a question using the question id for an authenticated user
const geScoreByUserIdAndQuestionId = async (req, res) => {
  try {
    const {currentQuarter, currentSession} = await current()

    const staff = await Staff.findById(req.params.id)
    const scores = await Score.find({
      user: req.params.id,
      question: req.params.q_id,
      session: currentSession,
      quarter: currentQuarter,
    }).populate("question").populate({
      path: "user",
      select: "fullname email department manager role isManager"
    });
    
    if (scores.length < 1) {
      return new ErrorResponseJSON(res, "Staff's scores not found!", 404)
    }

    res.status(200).json({
      success: true,
      staff: staff,
      data: scores,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get a score's details
const getScore = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id)
      .populate("question").populate({
      path: "user",
      select: "fullname email department manager role isManager"
    });

    if (!score) {
      return new ErrorResponseJSON(res, "Score not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Upadate a score's details
const updateScore = async (req, res) => {
  try {
    const { body } = req;

    const score = await Score.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Delete a score
const deleteScore = async (req, res) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);
    if (!score) {
      return new ErrorResponseJSON(res, "Score not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: score,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

module.exports = {
  createScore,
  getAllScores,
  getCurrentUserScores,
  getCurrentUserScoresByQuestionId,
  getUserScores,
  getScoresByUserId,
  geScoreByUserIdAndQuestionId,
  getScore,
  updateScore,
  deleteScore
}