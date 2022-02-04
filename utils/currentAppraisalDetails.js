const Appraisal = require("../models/Appraisal")

exports.current = async () => {
  const appraisal = await Appraisal.findOne({status: "Started"})
  console.log(appraisal)
  return {appraisal: appraisal, session: appraisal.session, quarter: appraisal.quarter}
}

