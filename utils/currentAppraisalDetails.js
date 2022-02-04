const Appraisal = require("../models/Appraisal")

const current = async () => {
  const appraisal = await Appraisal.findOne({status: "Started"})
  console.log(appraisal)
  return {appraisal: appraisal, session: appraisal.session, quarter: appraisal.quarter}
}

module.exports = current
