const Initiative = require("../models/Initiative");
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

//controller for score for staff initiative
// const updateInitiativeWithScore = async (req, res) => {
//   try {
//     const { body, params, user } = req;

//     const { financial, customer, internal, learning } = body;

//     const staffResult = await Result.findById(params.id).populate("user");

//     if (!staffResult) {
//       return res.status(404).json({
//         success: false,
//         msg: "Result details not found",
//       });
//     }

//     const { score, managerscore } = staffResult;

//     if (user == staffResult.user.manager) {
//       // if (checkStaff.isManager) {
//       staffResult.managerscore.financial = financial;
//       staffResult.managerscore.internal = internal;
//       staffResult.managerscore.customer = customer;
//       staffResult.managerscore.innovationlearningandgrowth = learning;

//       return res.status(200).json({
//         success: true,
//         msg: "score added",
//         data: staffResult,
//       });
//     } else {
//       staffResult.score.financial = financial;
//       staffResult.score.internal = internal;
//       staffResult.score.customer = customer;
//       staffResult.score.innovationlearningandgrowth = learning;

//       await staffResult.save();

//       return res.status(200).json({
//         success: true,
//         msg: "staff score added",
//         data: staffResult,
//       });
//     }
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       msg: err.message,
//     });
//   }
// };

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
      .populate("perspective");

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
  // updateInitiativeWithScore,
  getStaffInitiatives,
};
