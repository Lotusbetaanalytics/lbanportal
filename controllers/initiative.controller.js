const UserInitiative = require("../models/Initiative");
const Perspective = require("../models/Perspective");
const Result = require("../models/Result");
const Staff = require("../models/Staff");

const addInitiative = async (req, res) => {
  try {
    const { body, user } = req;

    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }

    const newPerspective = new Perspective();
    await newPerspective.save();
    const initiative = new UserInitiative({
      ...body,
      perspective: newPerspective._id,
      user,
    });

    await initiative.save();

    return res.status(200).json({
      success: true,
      msg: "Initiative added",
      data: initiative,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//controller for score for staff initiative
const updateInitiativeWithScore = async (req, res) => {
  try {
    const { body, params, user } = req;

    const { financial, customer, internal, learning } = body;

    if (!financial || !customer || !internal || !learning) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }

    const foundResult = await Result.findById(params.id);

    if (!foundResult) {
      return res.status(404).json({
        success: false,
        msg: "Result details not found",
      });
    }
    const checkStaff = await Staff.findById(user);

    if (checkStaff.role === "Manager") {
      foundResult.managerscore.financial = financial;
      foundResult.managerscore.internal = internal;
      foundResult.managerscore.customer = customer;
      foundResult.managerscore.innovationlearningandgrowth = learning;

      await foundResult.save();

      return res.status(200).json({
        success: true,
        msg: "score added",
        data: foundResult,
      });
    } else {
      foundResult.score.financial = financial;
      foundResult.score.internal = internal;
      foundResult.score.customer = customer;
      foundResult.score.innovationlearningandgrowth = learning;

      await foundResult.save();

      return res.status(200).json({
        success: true,
        msg: "score added",
        data: foundResult,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//delete an initiative
const removeInitiative = async (req, res) => {
  try {
    const { id } = req.params;

    const foundInitiative = await UserInitiative.findByIdAndDelete(id);

    if (!foundInitiative) {
      return res.status(404).json({
        success: false,
        msg: "Initiative not found",
      });
    }

    res.status(200).json({
      success: true,
      data: foundInitiative,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// staff get their initiative
const getInitiatives = async (req, res) => {
  try {
    const { user } = req;

    const foundInitiatives = await UserInitiative.find({
      user,
    })
      .sort({ _id: -1 })
      .populate("perspective result");

    if (!foundInitiatives) {
      return res.status(404).json({
        success: false,
        msg: "Initiative not found",
      });
    }

    res.status(200).json({
      success: true,
      data: foundInitiatives,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
//Controller for a Manager to get staff initiative
const getStaffInitiatives = async (req, res) => {
  try {
    const { id } = req.params;

    const foundStaffInitiatives = await UserInitiative.findById(id)
      .sort({ _id: -1 })
      .populate("perspective");

    if (!foundStaffInitiatives) {
      return res.status(404).json({
        success: false,
        msg: "Initiative not found",
      });
    }

    res.status(200).json({
      success: true,
      data: foundStaffInitiatives,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  addInitiative,
  removeInitiative,
  getInitiatives,
  updateInitiativeWithScore,
  getStaffInitiatives,
};
