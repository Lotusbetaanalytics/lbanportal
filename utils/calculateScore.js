const Score = require("../models/Score")
const Initiative = require("../models/Initiative")
const AppraisalA = require("../models/AppraisalA")
const Result = require("../models/Result")
const current = require("./currentAppraisalDetails")
const Perspective = require("../models/Perspective")

const ResultScore = async (req, scoreType="score", finalResult=null) => {
  const {currentSession, currentQuarter} = await current()
  const userScores = await Score.find({
    user: req.user,
    quarter: currentQuarter,
    session: currentSession,
  }).populate("user question")
  // const userInitiatives = Initiative.find({
  //   user: req.user,
  //   quarter: currentQuarter,
  //   session: currentSession,
  // })
  const allPerspectives = await Perspective.find()
  let perspectiveTitles = []
  let n = 0
  let scoreValue = 0
  let resultDict = {}
  let finalInitiativeScore = 0
  let finalAppraisalAScore = 0

  for (const [key, perspective] of Object.entries(allPerspectives)) {
    perspectiveTitles.push(perspective.title)
  } 

  console.log(`\nuser: ${req.user}\n\nuserScores: ${userScores[0].id}\n\nperspectiveTitles: ${perspectiveTitles}\n`)
  // console.log(`${perspectiveTitles[0]}`)

  for (const [key, score] of Object.entries(userScores)) {
    console.log(`${score._qid}: ${score}\nscoreValue: ${score[`${scoreType}`]}`)
    if (score.question.perspective || score._qid == "Initiative"){
      const question = await Initiative.findById(score.question).populate("perspective")
      let scorePerspectiveTitle = question.perspective.title
      // const perspectivePercentage = question.perspective.percentage
      console.log(`\nInitiative: ${question}\n\nscorePerspectiveTitle: ${scorePerspectiveTitle}`)

      for (let i = 0; i < perspectiveTitles.length; i++) {
        console.log(`\nCurrent Iter: ${i}\n`)
        console.log(`scorePerspectiveTitle: ${scorePerspectiveTitle}\n`)
        console.log(`perspectiveTitles: ${perspectiveTitles}\n`)
        // console.log(`perspectiveTitles: ${perspectiveTitles}\n`)
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
          // resultDict[`${title}`] = 0

          // resultDict[`${title}`] += scoreValue
          // resultDict.title = 0
          // resultDict.title += scoreValue
          // resultDict[`${title}`] += score[` ${scoreType}`]
          resultDict[`${title}`].score += scoreValue
          resultDict[`${title}`].len = oldLength + 1
          resultDict[`${title}`].maxScore = resultDict[`${title}`].len * 5
          resultDict[`${title}`].percentage = (resultDict[`${title}`].score / resultDict[`${title}`].maxScore) * resultDict[`${title}`].maxPercentage
          console.log(`resultDict: ${resultDict}\n`)
          console.log(`resultDict[${title}]: {score: ${resultDict[`${title}`].score}, len: ${resultDict[`${title}`].len}, percentage: ${resultDict[`${title}`].percentage}, maxScore: ${resultDict[`${title}`].maxScore}, maxPercentage: ${resultDict[`${title}`].maxPercentage}} \n`)
        }
      }

      scoreValue = 0

      // for (const [key, result] of Object.entries(resultDict)) {
      //   console.log(`\n\nResults: {${key}: ${result}}\n`)
      // }
    }
    // resultDictList = [...resultDict]
    // console.log(`\nResultDict: ${resultDictList}\n\n`)

    // if (scorePerspective && scorePerspective == perspectiveTitles[0]) {
    //   console.log(scorePerspective)
    // } else if (scorePerspective && scorePerspective == perspectiveTitles[1]) {

    // } else if (scorePerspective && scorePerspective == perspectiveTitles[2]) {}

    if (score.question.description || score._qid == "AppraisalA") {
      const questionA = await AppraisalA.findById(score.question)
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
        console.log(`appraisalAMaxScore: ${appraisalAMaxScore}, finalAppraisalAScore: ${finalAppraisalAScore}`)
      }
    }

  }
  console.log(`\n\nResults:`)
  for (const [key, result] of Object.entries(resultDict)) {
    // const relevantPerspective = await Perspective.findOne({title: key})
    // const relevantScores = await Score.find({
    //   user: req.user,
    //   question: relevantPerspective.id,
    //   quarter: currentQuarter,
    //   session: currentSession,
    // })

    // console.log(`{${key}: ${result}}\n\nperspective: ${relevantPerspective.id}\n`)
    console.log(`{${key}: ${result}}\n`)

    finalInitiativeScore += result.percentage
    console.log(`finalInitiativeScore: ${finalInitiativeScore}`)

    for (const [key, attribute] of Object.entries(result)) {
      console.log(`{${key}: ${attribute}}\n`)
    }
  }
  console.log(`\n\n`)
  console.log(`finalInitiativeScore: ${finalInitiativeScore}`)

  const finalScore = (finalInitiativeScore + finalAppraisalAScore) / 2

  console.log(`finalScore: ${finalScore}`)

  if (finalResult) {
    finalResult.score = finalScore
    finalResult.save()
  }
  return finalScore
}

module.exports = ResultScore