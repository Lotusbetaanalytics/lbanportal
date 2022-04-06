const Appraisal = require("../models/Appraisal");

const current = async () => {
  try {
    const appraisal = await Appraisal.findOne({ status: "Started" });
    return {
      currentAppraisal: appraisal,
      currentSession: appraisal.session,
      currentQuarter: appraisal.quarter,
    };
  } catch (err) {
    return {
      currentAppraisal: "Not Available",
      currentSession: "Not Available",
      currentQuarter: "Not Available",
    };
  }
};

module.exports = current;
