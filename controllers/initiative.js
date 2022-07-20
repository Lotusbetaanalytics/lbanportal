const Initiative = require("../models/Initiative");
const UserInitiative = require("../models/Initiative");
const Perspective = require("../models/Perspective");
const Result = require("../models/Result");
const Score = require("../models/Score");
const Staff = require("../models/Staff");
const current = require("../utils/currentAppraisalDetails");
const { ErrorResponseJSON } = require("../utils/errorResponse");
const { deleteAScoreRecord } = require("./score");
const axios = require("axios");

// Create an initiative
const addInitiative = async (req, res) => {
  try {
    const { body, user } = req;

    body.user = user;

    const initiative = await Initiative.create(body);

    const findInitiative = await Initiative.findById(initiative._id).populate(
      "perspective"
    );

    return res.status(200).json({
      success: true,
      msg: "Initiative added",
      data: findInitiative,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Delete an initiative
const removeInitiative = async (req, res) => {
  try {
    const { id } = req.params;

    const foundInitiative = await UserInitiative.findByIdAndDelete(id);

    //find score with the same initiative id
    const foundScore = await Score.findOne({ question: id });

    if (foundScore) {
      console.log("deleting....");
      await axios
        .delete(
          `https://lotusportalapi.herokuapp.com/api/v1/score/${foundScore._id}`
        )
        .then((response) => {
          console.log("response deleted");
        })
        .catch((error) => {
          console.log("error deleting score", error);
        });
    }

    if (!foundInitiative) {
      return new ErrorResponseJSON(res, "Initiative not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: foundInitiative,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};
// Edit an initiative
const editInitiative = async (req, res) => {
  try {
    const { id } = req.params;

    let foundInitiative = await UserInitiative.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!foundInitiative) {
      return new ErrorResponseJSON(res, "Initiative not found!", 404);
    }

    foundInitiative = await Initiative.findById(foundInitiative._id).populate(
      "perspective"
    );

    res.status(200).json({
      success: true,
      data: foundInitiative,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get Initiative for authenticated user
const getInitiatives = async (req, res) => {
  try {
    const { user } = req;

    const foundInitiatives = await UserInitiative.find({ user })
      .sort({ _id: -1 })
      .populate({
        path: "user",
        select: "fullname email department manager role isManager",
      })
      .populate("perspective");

    if (!foundInitiatives) {
      return new ErrorResponseJSON(res, "Initiative not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: foundInitiatives,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Controller for a Manager to get staff initiative
const getStaffInitiatives = async (req, res) => {
  try {
    const { id } = req.params;

    const initiative = await UserInitiative.findById(id)
      .populate({
        path: "user",
        select: "fullname email manager role isManager",
      })
      .populate("perspective");

    if (!initiative) {
      return new ErrorResponseJSON(res, "Initiative not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: initiative,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get all initiatives for a user using their id
const getInitiativeByStaffId = async (req, res) => {
  try {
    const { currentSession } = await current();

    const staff = await Staff.findById(req.params.id);
    const initiatives = await Initiative.find({
      user: req.params.id,
      session: currentSession,
    })
      .populate({
        path: "user",
        select: "fullname email department manager role isManager",
      })
      .populate("perspective");

    if (initiatives.length < 1) {
      res.status(404).json({
        success: false,
        msg: "Staff's initiatives not found",
      });
    }

    res.status(200).json({
      success: true,
      staff: staff,
      data: initiatives,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

module.exports = {
  addInitiative,
  removeInitiative,
  getInitiatives,
  getStaffInitiatives,
  getInitiativeByStaffId,
  editInitiative,
};
