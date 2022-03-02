const Perspective = require("../models/Perspective")
const {ErrorResponseJSON} = require("../utils/errorResponse")

// Create a perspective
const createPerspective = async (req, res) => {
  try {
    let { body } = req;

    const findPerspective = await Perspective.find({title: body.title});
    const allPerspectives = await Perspective.find();
    let totalPercentage = 0

    if (findPerspective.length > 0) {
      return new ErrorResponseJSON(res, "This perspective already exists, update it instead!", 400)
    };

    for (const [key, perspective] of Object.entries(allPerspectives)) {
      totalPercentage += perspective.percentage
    }
    totalPercentage += body.percentage

    if (totalPercentage > 100) {
      return new ErrorResponseJSON(res, "Total percentage for all perspective exceeeds 100!", 400)
    }

    const perspective = await Perspective.create(body);

    res.status(200).json({
      success: true,
      data: perspective,
    });

  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get all perspectives
const getAllPerspectives = async (req, res) => {
  try {
    const perspective = await Perspective.find({});
    if (!perspective || perspective.length < 1) {
      return new ErrorResponseJSON(res, "Perspectives not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: perspective,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Get a perspective's details
const getPerspective = async (req, res) => {
  try {
    const perspective = await Perspective.findById(req.params.id);
    if (!perspective) {
      return new ErrorResponseJSON(res, "Perspective not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: perspective,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Upadate a perspective's details
const updatePerspective = async (req, res) => {
  try {
    const { body } = req;

    const allPerspectives = await Perspective.find();
    const currentPerspective = await Perspective.findById(req.params.id)
    let totalPercentage = 0
    
    for (const [key, perspective] of Object.entries(allPerspectives)) {
      console.log(`\nkey: ${key}\n\nperspective: ${perspective}\n`)
      if (perspective.title != currentPerspective.title) {
        totalPercentage += perspective.percentage
      }
    }
    totalPercentage += body.percentage

    if (totalPercentage > 100) {
      return new ErrorResponseJSON(res, "Total percentage for all perspective exceeeds 100!", 400)
    }

    const perspective = await Perspective.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: perspective,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

// Delete a perspective
const deletePerspective = async (req, res) => {
  try {
    const perspective = await Perspective.findByIdAndDelete(req.params.id);
    if (!perspective) {
      return new ErrorResponseJSON(res, "Perspective not found!", 404)
    }
    
    res.status(200).json({
      success: true,
      data: perspective,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500)
  }
};

module.exports = {
  createPerspective,
  getAllPerspectives,
  getPerspective,
  updatePerspective,
  deletePerspective
}