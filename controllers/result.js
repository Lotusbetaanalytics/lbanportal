const Result = require("../models/Result");
const Staff = require("../models/Staff");
const current = require("../utils/currentAppraisalDetails");
const resultScore = require("../utils/calculateScore");
const sendEmail = require("../utils/sendEmail");
const {
  createResultEmail,
  updateResultEmail,
  rejectedResultEmail,
  acceptedResultEmail,
} = require("../utils/sendResultEmail");
const { convertQuarter, hrEmail, firstName } = require("../utils/utils");
const { ErrorResponseJSON } = require("../utils/errorResponse");
const Log = require("../models/Log");
const Report = require("../models/Report");
const mongoose = require("mongoose");

// Create a result
const createResult = async (req, res) => {
  const { currentSession, currentQuarter } = await current();

  try {
    let { user, body } = req;
    const { session, quarter } = body;

    const existingResult = await Result.findOne({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    });

    const score = await resultScore(req);

    if (!session || !quarter) {
      body.session = currentSession;
      body.quarter = currentQuarter;
    }
    body.user = user;
    body.score = Number(score.score.toFixed(2));
    body.sectionascore = Number(score.sectionAScore.toFixed(2));
    body.sectionbscore = Number(score.sectionBScore.toFixed(2));

    try {
      const managerScore = await resultScore(req, (scoreType = "managerscore"));
      body.managerscore = Number(managerScore.score.toFixed(2));
      body.sectionamanagerscore = Number(managerScore.sectionAScore.toFixed(2));
      body.sectionbmanagerscore = Number(managerScore.sectionBScore.toFixed(2));
    } catch (err) {
      console.log(err.message);
    }

    let result;

    if (existingResult) {
      result = await Result.findByIdAndUpdate(existingResult.id, body, {
        new: true,
        runValidators: true,
      });

      await updateResultEmail(req, existingResult, result, hrEmail);

      // return new ErrorResponseJSON(res, "Result already exists", 400)
    } else {
      result = await Result.create(body);

      try {
        await createResultEmail(req, existingResult, result, hrEmail);
      } catch (err) {
        return new ErrorResponseJSON(res, err.message, 500);
      }
    }
    const staff = await Staff.findById(result.user);

    try {
      await Log.create({
        title: "Appraisal completed",
        description: `Appraisal has been completed for ${staff.fullname} for the ${currentQuarter} of the ${currentSession} session`,
      });
    } catch (err) {
      return new ErrorResponseJSON(res, err.message, 500);
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get all results
const getAllResult = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();
    const result = await Result.find({}).populate({
      path: "user",
      select: "fullname email department manager role isManager photo",
    });

    res.status(200).json({
      success: true,
      data: result.filter(
        (item) =>
          item.session === currentSession && item.quarter === currentQuarter
      ),
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};
// Get all results
const getResults = async (req, res) => {
  try {
    const result = await Result.find({}).populate({
      path: "user",
      select: "fullname email department manager role isManager photo",
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get the current appraisal result for an authenticated staff
const getCurrentResult = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();

    const result = await Result.findOne({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    }).populate({
      path: "user",
      select: "fullname email department manager role isManager",
    });

    // if (!result) {
    //   return new ErrorResponseJSON(res, "Result not found!", 404);
    // }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Upadate the current appraisal result for an authenticated staff
const updateCurrentResult = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();
    const { body } = req;

    const existingResult = await Result.findOne({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    }).populate({
      path: "user",
      select: "fullname email department manager role isManager",
    });

    if (!existingResult) {
      return new ErrorResponseJSON(res, "Result not found!", 400);
    }

    const score = await resultScore(req);
    const managerScore = await resultScore(req, (scoreType = "managerscore"));
    body.score = score;
    body.managerscore = Number(managerScore.toFixed(2));

    const result = await Result.findByIdAndUpdate(existingResult.id, body, {
      new: true,
      runValidators: true,
    });

    await updateResultEmail(req, existingResult, result, hrEmail);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get all results by quarter for an authenticated staff
const getQuarterlyResult = async (req, res) => {
  try {
    const { currentSession } = await current();

    const staff = await Staff.findById(req.user);
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
    if (
      !firstQuarterResult ||
      !secondQuarterResult ||
      !thirdQuarterResult ||
      !fourthQuarterResult
    ) {
      return new ErrorResponseJSON(res, "Results not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: {
        staff: staff,
        firstQuarter: firstQuarterResult,
        secondQuarter: secondQuarterResult,
        thirdQuarter: thirdQuarterResult,
        fourthQuarter: fourthQuarterResult,
      },
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get the current appraisal result for a staff
const getCurrentResultByStaffId = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();

    const staff = await Staff.findById(req.params.id);
    const firstQuarterResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: "First Quarter",
    });
    const secondQuarterResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: "Second Quarter",
    });
    const thirdQuarterResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: "Third Quarter",
    });
    const fourthQuarterResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: "Fourth Quarter",
    });

    if (
      !firstQuarterResult ||
      !secondQuarterResult ||
      !thirdQuarterResult ||
      !fourthQuarterResult
    ) {
      return new ErrorResponseJSON(res, "Results not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: {
        staff: staff,
        firstQuarter: firstQuarterResult,
        secondQuarter: secondQuarterResult,
        thirdQuarter: thirdQuarterResult,
        fourthQuarter: fourthQuarterResult,
      },
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};
const getResultByStaffId = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();

    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return new ErrorResponseJSON(res, `Staff not found!`, 404);
    }

    const staffResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: currentQuarter,
    });

    if (!staffResult) {
      return new ErrorResponseJSON(
        res,
        `Result for ${staff.fullname} not found!`,
        404
      );
    }

    res.status(200).json({
      success: true,
      data: {
        staff: staff,
        result: staffResult,
      },
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Update the current appraisal result for a staff using staff id
const UpdateCurrentResultByStaffId = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();
    const { user, body } = req;

    const existingResult = await Result.findOne({
      user: req.params.id,
      session: currentSession,
      quarter: currentQuarter,
    });
    if (!existingResult) {
      return new ErrorResponseJSON(res, "Result not found!", 404);
    }

    const staff = await Staff.findById(req.params.id);
    const manager = await Staff.findById(user);

    if (
      JSON.stringify(mongoose.Types.ObjectId(user)) !=
      JSON.stringify(mongoose.Types.ObjectId(staff.manager))
    ) {
      return new ErrorResponseJSON(res, "You are not authorized!", 400);
    }

    const score = await resultScore(req);
    // const managerScore = await resultScore(req, (scoreType = "managerscore"));
    body.score = Number(score.score.toFixed(2));
    // body.managerscore = managerScore;

    try {
      const managerScore = await resultScore(req, (scoreType = "managerscore"));
      body.managerscore = Number(managerScore.score.toFixed(2));
      body.sectionamanagerscore = Number(managerScore.sectionAScore.toFixed(2));
      body.sectionbmanagerscore = Number(managerScore.sectionBScore.toFixed(2));
    } catch (err) {
      console.log(err.message);
    }

    const result = await Result.findByIdAndUpdate(existingResult.id, req.body, {
      new: true,
      runValidators: true,
    });

    const findReport = await Report.find({ staff: req.params.id });

    if (!findReport.length) {
      await Report.create({
        staffName: staff.fullname,
        staff: result.user,
        session: result.session,
        [currentQuarter]: result.managerscore,
        overall: result.overall,
        department: staff.department,
      });
    } else {
      const found = await Report.findById(findReport[0]._id);

      found.staffName = staff.fullname;
      found.staff = result.user;
      found.session = result.session;
      found[currentQuarter] = result.managerscore;
      found.department = staff.department;

      await found.save();

      let foundOverall = 0;

      if (
        found["First Quarter"] &&
        found["Second Quarter"] &&
        found["Third Quarter"] &&
        found["Fourth Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["First Quarter"] +
            found["Second Quarter"] +
            found["Third Quarter"] +
            found["Fourth Quarter"]) /
            4
        );
      } else if (
        !found["First Quarter"] &&
        found["Third Quarter"] &&
        found["Fourth Quarter"] &&
        found["Second Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["Second Quarter"] +
            found["Third Quarter"] +
            found["Fourth Quarter"]) /
            3
        );
      } else if (
        !found["Second Quarter"] &&
        found["Third Quarter"] &&
        found["Fourth Quarter"] &&
        found["First Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["First Quarter"] +
            found["Third Quarter"] +
            found["Fourth Quarter"]) /
            3
        );
      } else if (
        !found["Third Quarter"] &&
        found["Fourth Quarter"] &&
        found["Second Quarter"] &&
        found["First Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["Second Quarter"] +
            found["First Quarter"] +
            found["Fourth Quarter"]) /
            3
        );
      } else if (
        !found["Fouth Quarter"] &&
        found["Third Quarter"] &&
        found["Second Quarter"] &&
        found["First Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["Second Quarter"] +
            found["Third Quarter"] +
            found["First Quarter"]) /
            3
        );
      } else if (
        !found["First Quarter"] &&
        !found["Second Quarter"] &&
        found["Third Quarter"] &&
        found["Fourth Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["Third Quarter"] + found["Fourth Quarter"]) / 2
        );
      } else if (
        !found["First Quarter"] &&
        !found["Third Quarter"] &&
        found["Second Quarter"] &&
        found["Fourth Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["Second Quarter"] + found["Fourth Quarter"]) / 2
        );
      } else if (
        !found["First Quarter"] &&
        !found["Fourth Quarter"] &&
        found["Third Quarter"] &&
        found["Second Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["Third Quarter"] + found["Second Quarter"]) / 2
        );
      } else if (
        found["First Quarter"] &&
        !found["Fourth Quarter"] &&
        !found["Third Quarter"] &&
        found["Second Quarter"]
      ) {
        foundOverall = Math.ceil(
          (found["First Quarter"] + found["Second Quarter"]) / 2
        );
      } else if (
        found["First Quarter"] &&
        !found["Second Quarter"] &&
        !found["Third Quarter"] &&
        !found["Fourth Quarter"]
      ) {
        foundOverall = Math.ceil(found["First Quarter"]);
      } else if (
        !found["First Quarter"] &&
        found["Second Quarter"] &&
        !found["Third Quarter"] &&
        !found["Fourth Quarter"]
      ) {
        foundOverall = Math.ceil(found["Second Quarter"]);
      } else if (
        !found["First Quarter"] &&
        !found["Second Quarter"] &&
        found["Third Quarter"] &&
        !found["Fourth Quarter"]
      ) {
        foundOverall = Math.ceil(found["Third Quarter"]);
      } else if (
        !found["First Quarter"] &&
        !found["Second Quarter"] &&
        !found["Third Quarter"] &&
        found["Fourth Quarter"]
      ) {
        foundOverall = Math.ceil(found["Fourth Quarter"]);
      }

      await Report.findByIdAndUpdate(
        found._id,
        {
          overall: foundOverall,
        },
        {
          new: true,
        }
      );
    }

    try {
      await Log.create({
        title: "Manager Appraisal",
        description: `${staff.fullname} has been appraised by ${manager.fullname} for the ${currentQuarter} of the ${currentSession} session`,
      });
    } catch (err) {
      return new ErrorResponseJSON(res, err.message, 500);
    }

    await updateResultEmail(req, existingResult, result, hrEmail);

    res.status(200).json({
      success: true,
      data: result,
      staff: staff,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Reject the current appraisal result's manager score for an authenticated user
const rejectCurrentManagerScore = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();
    const { user, body } = req;

    const existingResult = await Result.findOne({
      user: user,
      session: currentSession,
      quarter: currentQuarter,
    });
    if (!existingResult) {
      return new ErrorResponseJSON(res, "Result not found!", 404);
    }

    body.status = "Rejected";

    const result = await Result.findByIdAndUpdate(existingResult.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: "user",
      select: "fullname email department manager role isManager",
    });

    await rejectedResultEmail(req, existingResult, result, hrEmail);
    const staff = await Staff.findById(result.user);
    await Log.create({
      title: "Manager score rejected",
      description: `Manager score has been rejected by ${staff.fullname} for the ${currentQuarter} of the ${currentSession} session`,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Accept the current appraisal result's manager score for an authenticated user
const acceptCurrentManagerScore = async (req, res) => {
  try {
    const { currentSession, currentQuarter } = await current();
    const { user, body } = req;

    const existingResult = await Result.findOne({
      user: user,
      session: currentSession,
      quarter: currentQuarter,
    });
    if (!existingResult) {
      return new ErrorResponseJSON(res, "Result not found!", 404);
    }

    body.status = "Accepted";

    const result = await Result.findByIdAndUpdate(existingResult.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: "user",
      select: "fullname email department manager role isManager",
    });

    await acceptedResultEmail(req, existingResult, result, hrEmail);
    const staff = await Staff.findById(result.user);
    await Log.create({
      title: "Manager score accepted",
      description: `Manager score has been accepted by ${staff.fullname} for the ${currentQuarter} of the ${currentSession} session`,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Get a result's details
const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate({
      path: "user",
      select: "fullname email department manager role isManager photo",
    });

    if (!result) {
      return new ErrorResponseJSON(res, "Result not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Upadate a result's details
const updateResult = async (req, res) => {
  try {
    const { body } = req;

    const existingResult = await Result.findById(req.params.id).populate({
      path: "user",
      select: "fullname email department manager role isManager",
    });

    if (!existingResult) {
      return new ErrorResponseJSON(res, "Result not found!", 400);
    }

    const score = await resultScore(req);
    const managerScore = await resultScore(req, (scoreType = "managerscore"));
    body.score = score;
    body.managerscore = managerScore;

    const result = await Result.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    await updateResultEmail(req, existingResult, result, hrEmail);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

// Delete a result
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return new ErrorResponseJSON(res, "Result not found!", 404);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return new ErrorResponseJSON(res, err.message, 500);
  }
};

module.exports = {
  createResult,
  getAllResult,
  getCurrentResult,
  updateCurrentResult,
  getQuarterlyResult,
  getCurrentResultByStaffId,
  UpdateCurrentResultByStaffId,
  rejectCurrentManagerScore,
  acceptCurrentManagerScore,
  getResult,
  updateResult,
  deleteResult,
  getResults,
  getResultByStaffId,
};
