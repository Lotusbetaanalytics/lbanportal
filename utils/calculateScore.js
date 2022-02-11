const Score = require("../models/Score")
const Initiative = require("../models/Initiative")
const current = require("./currentAppraisalDetails")
const Perspective = require("../models/Perspective")

const ResultScore = async (req, scoreType="score", finalResult=null) => {
  const {currentSession, currentQuarter} = await current()
  const userScores = await Score.find({
    user: req.user,
    quarter: currentQuarter,
    session: currentSession,
  }).populate("user question")

  const allPerspectives = await Perspective.find()
  let perspectiveTitles = []
  let scoreValue = 0
  let resultDict = {}
  let finalInitiativeScore = 0
  let finalAppraisalAScore = 0

  for (const [key, perspective] of Object.entries(allPerspectives)) {
    perspectiveTitles.push(perspective.title)
  } 

  for (const [key, score] of Object.entries(userScores)) {

    if (score.question.perspective || score._qid == "Initiative"){
      const question = await Initiative.findById(score.question).populate("perspective")
      let scorePerspectiveTitle = question.perspective.title

      for (let i = 0; i < perspectiveTitles.length; i++) {

        if (scorePerspectiveTitle == perspectiveTitles[i]) {
          const scorePerspective = await Perspective.findOne({title: scorePerspectiveTitle})
          let title = perspectiveTitles[i]
          let oldValue = 0
          let oldLength = 0

          if (resultDict[`${title}`]) {
            oldValue = resultDict[`${title}`].score
            oldLength = resultDict[`${title}`].len
          }

          scoreValue = oldValue + score[`${scoreType}`]
          resultDict[`${title}`] = {"score": 0, "percentage": 0, "len": 0, "maxScore": 0, "maxPercentage": scorePerspective.percentage}

          resultDict[`${title}`].score += scoreValue
          resultDict[`${title}`].len = oldLength + 1
          resultDict[`${title}`].maxScore = resultDict[`${title}`].len * 5
          resultDict[`${title}`].percentage = (resultDict[`${title}`].score / resultDict[`${title}`].maxScore) * resultDict[`${title}`].maxPercentage
        }
      }

      scoreValue = 0
    }

    if (score.question.description || score._qid == "AppraisalA") {
      const appraisalAScores = await Score.find({
        user: req.user,
        _qid: "AppraisalA",
        quarter: currentQuarter,
        session: currentSession,
      })

      for (const [key, score] of Object.entries(appraisalAScores)) {
        appraisalACurrentScore += score[`${scoreType}`]
        let appraisalAMaxScore = appraisalAScores.length * 5
        finalAppraisalAScore = (appraisalACurrentScore / appraisalAMaxScore) * 100
      }
    }
  }

  for (const [key, result] of Object.entries(resultDict)) {
    finalInitiativeScore += result.percentage
  }
  const finalScore = (finalInitiativeScore + finalAppraisalAScore) / 2

  if (finalResult) {
    finalResult.score = finalScore
    finalResult.save()
  }
  return finalScore
}

module.exports = ResultScore