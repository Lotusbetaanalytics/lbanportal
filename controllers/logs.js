// const Result = require("../models/Result");
// const Staff = require("../models/Staff");
// const Calibration = require("../models/Calibration");
// const Perspective = require("../models/Perspective");
// const AppraisalA = require("../models/AppraisalA");


// // Get logs
// const getLogs = async (req, res) => {
//   try {
//     const results = await Result.find().sort("-createdAt").populate("user")
//     const staff = await Staff.find().sort("-createdAt").populate("manager")
//     const calibration = await Calibration.find().sort("-createdAt").populate("hr staff")
//     const perspectives = await Perspective.find().sort()
//     const appraisalAs = await AppraisalA.find().sort("-createdAt")

//     res.status(200).json({
//       success: true,
//       data: {
//         results: results,
//         staff: staff,
//         calibration: calibration,
//         perspectives: perspectives,
//         sectionA: appraisalAs,
//       },
//     });
//   } catch (err) {
//     return new ErrorResponseJSON(res, err.message, 500);
//   }
// }

// module.exports = {
//   getLogs
// }