const Perspective = require("../models/Perspective")
const Initiative = require("../models/Initiative")
const current = require("../utils/currentAppraisalDetails");


const canStartAppraisal = async (req) => {
  const { currentSession } = await current();
  allPerspectives = await Perspective.find();
  for (const [key, perspective] of Object.entries(allPerspectives)) {
    let initiatives = await Initiative.find({
      user: req.user,
      perspective: perspective._id,
      session: currentSession,
    })
    if (initiatives.length < 1) return false
  }
  return true
}