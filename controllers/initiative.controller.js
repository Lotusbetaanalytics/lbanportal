const Initiative = require("../models/Initiative");
const UserInitiative = require("../models/Initiative");
const Perspective = require("../models/Perspective");
const Result = require("../models/Result");
const Staff = require("../models/Staff");
const current = require("../utils/currentAppraisalDetails")

const addInitiative = async (req, res) => {
  try {
    const { body, user } = req;

    if (!body) {
      return res
        .status(400)
        .json({ success: false, msg: "No data was provided!" });
    }

    // const newPerspective = new Perspective();
    // await newPerspective.save();
    // const initiative = new UserInitiative({
    //   ...body,
    //   perspective: newPerspective._id,
    //   user,
    // });

    // await initiative.save();

    body.user = user

    const initiative = await Initiative.create(body)

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
      .populate("perspective")
      .populate({
        path: "user",
        select: "fullname email department manager role isManager"
      });

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
      .populate("perspective")
      .populate({
        path: "user",
        select: "fullname email department manager role isManager"
      });

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

//Get all initiatives for a user using their id
const getInitiativeByStaffId = async (req, res) => {
  try {
    const {currentSession} = await current()
    const staff = await Staff.findById(req.params.id)
    const initiatives = await Initiative.find({
      user: req.params.id,
      session: currentSession,
    }).populate("perspective")
      .populate({
        path: "user",
        select: "fullname email department manager role isManager"
      });
    
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
  getStaffInitiatives,
  getInitiativeByStaffId,
};
