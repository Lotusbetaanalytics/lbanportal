const Appraisal = require("../models/Appraisal")

const current = async () => {
  const appraisal = await Appraisal.findOne({status: "Started"})
  return {
    currentAppraisal: appraisal,
    currentSession: appraisal.session,
    currentQuarter: appraisal.quarter
  }
}

module.exports = current
