const Perspective = require("../models/Perspective")
const current = require("../utils/currentAppraisalDetails");

//Create a perspective
const createPerspective = async (req, res) => {
  // const {currentSession, currentQuarter} = await current()

  try {
    let { body } = req;
    const findPerspective = await Perspective.find({title: body.title});
    const allPerspectives = await Perspective.find();
    let totalPercentage = 0
    if (findPerspective.length > 0) {
      return res.status(400).json({
        success: false,
        msg: "This perspective already exists, update it instead",
      });
    };

    for (const perspective in allPerspectives) {
      totalPercentage += perspective.percentage
    }

    if (totalPercentage > 100) {
      return res.status(400).json({
        success: false,
        msg: "Total percentage for all perspective exceeeds 100%",
      });
    }

    const perspective = await Perspective.create(body);

    res.status(200).json({
      success: true,
      data: perspective,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all perspectives
const getAllPerspectives = async (req, res) => {
  try {
    const perspective = await Perspective.find({});
    if (!perspective) {
      return res
        .status(404)
        .json({ success: false, msg: "Perspectives not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: perspective,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get a perspective's details
const getPerspective = async (req, res) => {
  try {
    const perspective = await Perspective.findById(req.params.id);
    if (!perspective) {
      return res
        .status(404)
        .json({ success: false, msg: "Perspective not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: perspective,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Upadate a perspective's details
const updatePerspective = async (req, res) => {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }

    const allPerspectives = await Perspective.find();
    let totalPercentage = 0

    for (const perspective in allPerspectives) {
      totalPercentage += perspective.percentage
    }

    if (totalPercentage > 100) {
      return res.status(400).json({
        success: false,
        msg: "Total percentage for all perspective exceeeds 100%",
      });
    }

    const perspective = await Perspective.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: perspective,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Delete a perspective
const deletePerspective = async (req, res) => {
  try {
    const perspective = await Perspective.findByIdAndDelete(req.params._id);
    if (!perspective) {
      return res
        .status(404)
        .json({ success: false, msg: "Perspective not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: perspective,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createPerspective,
  getAllPerspectives,
  getPerspective,
  updatePerspective,
  deletePerspective
}