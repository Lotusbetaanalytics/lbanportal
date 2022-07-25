const Score = require("../models/Score");
const Initiative = require("../models/Initiative");
const AppraisalA = require("../models/AppraisalA");
const Perspective = require("../models/Perspective");
const Option = require("../models/Option");
const current = require("./currentAppraisalDetails");
const { ErrorResponse } = require("./errorResponse");


// for the result endpoints
const getUserId = req => {return req.params.id ? req.params.id : req.user}


const calculateSectionAScore = async (userId, session, quarter, scoreType) => {
  // get all section a questions (appraisal a) by the user for the quarter and session
  const sectionA = await AppraisalA.find();
  const largestAnswerOption = await Option.findOne().sort("-value")

  const sectionALength = sectionA.length;  // get length of all section a questions
  const largestAnswerOptionValue = largestAnswerOption.value;  // get max value for section a options
  let sectionAMaxScore = sectionALength * largestAnswerOptionValue;  // calculate section a max score
  
  console.log("scoreType", scoreType)
  console.log("largestAnswerOption value, sectionALength, sectionAMaxScore: ", largestAnswerOptionValue, sectionALength, sectionAMaxScore)

  const sectionAScores = []  // list of scores for section a for a staff
  let sectionAScore = 0  // the section a score value

  // iterate through all section a questions
  for (const [index, instance] of Object.entries(sectionA)) {
    console.log("index: ", index)
    console.log("instance id: ", instance._id)

    // get the response (score) for each section a question
    const instanceScores = await Score.find({
      user: userId,
      question: instance._id,
      quarter: quarter,
      session: session,
    }).populate("score managerscore")

    // check if there are multiple responses (scores) for the same section a question
    if (instanceScores.length > 1) {
      // throw new ErrorResponse(`There are multiple responses for Appraisal A with id: ${instance._id}`)
      console.log(`There are multiple responses for Appraisal A with id: ${instance._id}`.red)
    }

    // get the first response (score) for a section a question
    let instanceScoreValue;
    if (instanceScores.length < 1 || instanceScores[0][`${scoreType}`] == undefined) {
      // throw new ErrorResponse(`There are multiple responses for Section A with id: ${instance._id}`)
      console.log(`There are no responses for Section A with id: ${instance._id}`.bgBlue)
      instanceScoreValue = 0
      // continue  // this does not break the calculation
    } else {
      console.log(instanceScores)
      instanceScoreValue = await instanceScores[0][`${scoreType}`].value || 0
    }
    // let instanceScoreValue = await instanceScores[0][`${scoreType}`].value || 0
    console.log("instanceScoreValue", instanceScoreValue)

    // add the score value for the first response to a list
    sectionAScores.push(instanceScoreValue)
    // update the section a score value with the score value of the first response to the section a question
    sectionAScore += instanceScoreValue
  }

  console.log("sectionAScores", sectionAScores)

  console.log("sectionAScore", sectionAScore)

  // calculate the final score for section a as a percentage
  const sectionAFinalScore = (sectionAScore / sectionAMaxScore) * 100;
  console.log("sectionAFinalScore", sectionAFinalScore)

  return sectionAFinalScore
}


const calculateSectionBScore = async (userId, session, quarter, scoreType, detailed = false) => {
  // get all section b questions (initiatives) by the user for the quarter and session
  const sectionB = await Initiative.find({
    user: userId,
    quarter: quarter,
    session: session,
  }).populate("perspective result");
  const largestAnswerOption = await Option.findOne().sort("-value")

  const sectionBLength = sectionB.length;  // get length of all section b questions
  const largestAnswerOptionValue = largestAnswerOption.value;  // get max value for section b options
  let sectionBMaxScore = sectionBLength * largestAnswerOptionValue;  // calculate section b max score

  console.log("scoreType", scoreType)
  console.log("largestAnswerOption value, sectionBLength, sectionBMaxScore: ", largestAnswerOptionValue, sectionBLength, sectionBMaxScore)

  // create a list of results ordered by perspective titles
  const perspectives = await Perspective.find();
  const results = {}
  for (const [key, perspective] of Object.entries(perspectives)) {
    results[`${perspective.title}`] = {
      score: 0,
      percentage: 0,
      len: 0,
      maxScore: 0,
      maxPercentage: perspective.percentage,
    }
  }

  console.log("results, before calculation: ", results)

  let sectionBScore = 0  // the section b score value

  for (const [index, instance] of Object.entries(sectionB)) {
    console.log("index: ", index)
    console.log("instance: ", instance)

    const title = instance.perspective.title
    const item = results[`${title}`]
    console.log("title, item: ", title, item)

    const instanceScores = await Score.find({
      user: userId,
      question: instance._id,
      quarter: quarter,
      session: session,
    }).populate("user question score managerscore");

    // check if there are multiple responses (scores) for the same section b question
    if (instanceScores.length > 1) {
      // throw new ErrorResponse(`There are multiple responses for Initiative with id: ${instance._id}`)
      console.log(`There are multiple responses for Initiative with id: ${instance._id}`.red)
    }

    // get the first response (score) for a section b question
    let instanceScoreValue;
    if (instanceScores.length < 1 || instanceScores[0][`${scoreType}`] == undefined) {
      // throw new ErrorResponse(`There are multiple responses for Initiative with id: ${instance._id}`)
      console.log(`There are no responses for Initiative with id: ${instance._id}`.bgBlue)
      instanceScoreValue = 0
      // continue  // this breaks the calculation
    } else {
      instanceScoreValue = await instanceScores[0][`${scoreType}`].value || 0
    }
    console.log("instanceScoreValue", instanceScoreValue)
    
    // update the result object with this instance's details
    item.score += instanceScoreValue;
    item.len += 1;
    item.maxScore = item.len * largestAnswerOptionValue;
    // calculate score as a percentage out of 25%
    item.percentage = (item.score / item.maxScore) * item.maxPercentage;


    console.log("results, during calculation: ", results)
  }
  
  console.log("results, after calculation: ", results)
  
  if (detailed) return results

  // calculate section b score as a percentage
  for (const [key, result] of Object.entries(results)) {
    sectionBScore += result.percentage;
  }

  console.log("sectionBFinalScore", sectionBScore)
  return sectionBScore
}


const calculateScore = async (req, scoreType = "score", finalResult = undefined) => {
  /**
   * @summary
   *  Calculate total appraisal score for a user
   * 
   * @param scoreType - Type of score being calculated. Options are "score" or "managerscore"
   */

  const userId = getUserId(req)
  console.log("userId: ", userId)

  // get current quarter and session
  const { currentSession, currentQuarter } = await current();

  const sectionAFinalScore = await calculateSectionAScore(userId, currentSession, currentQuarter, scoreType)
  console.log("section a final score in calculate score function: ", sectionAFinalScore)

  const sectionBFinalScore = await calculateSectionBScore(userId, currentSession, currentQuarter, scoreType)
  console.log("section b final score in calculate score function: ", sectionBFinalScore)

  let finalAppraisalAScore = sectionAFinalScore || 0
  let finalInitiativeScore = sectionBFinalScore || 0
  // section b score is 80%, section a score is 20%, of total score
  const totalScore = (finalInitiativeScore * 0.8) + (finalAppraisalAScore * 0.2);

  if (finalResult) {
    finalResult.score = totalScore;
    finalResult.save();
  }
  // return totalScore;
  console.log("final score: ", totalScore)
  console.log("SomeBullShitToBreakTheCode")  // remove the "" to stop the code

  return {
    score: totalScore,
    sectionAScore: finalAppraisalAScore,
    sectionBScore: finalInitiativeScore,
  };
};


const ResultScore = async (req, scoreType = "score", finalResult = null) => {
  // scoreType options are "score" or "managerscore"


  // get user id
  const userId = req.params.id ? req.params.id : req.user


  const { currentSession, currentQuarter } = await current();
  const userScores = await Score.find({
    user: req.user,
    quarter: currentQuarter,
    session: currentSession,
  }).populate("user question score managerscore");
  const answerOptions = await Option.find({});
  console.log(`answerOptions length: ${answerOptions.length}`);

  const allPerspectives = await Perspective.find();
  let perspectiveTitles = [];
  let scoreValue = 0;
  let resultDict = {};
  let finalInitiativeScore = 0;
  let finalAppraisalAScore = 0;
  let appraisalACurrentScore = 0;

  // create a list of perspective titles
  for (const [key, perspective] of Object.entries(allPerspectives)) {
    perspectiveTitles.push(perspective?.title);
  }

  for (const [key, score] of Object.entries(userScores)) {
    // check if question is an initiative
    if (score?.question?.perspective || score._qid == "Initiative") {
      const question = await Initiative.findById(score?.question).populate(
        "perspective"
      );
      let scorePerspectiveTitle = question?.perspective?.title;

      for (let i = 0; i < perspectiveTitles.length; i++) {
        if (scorePerspectiveTitle == perspectiveTitles[i]) {
          const scorePerspective = await Perspective.findOne({
            title: scorePerspectiveTitle,
          });
          let title = perspectiveTitles[i];
          let oldValue = 0;
          let oldLength = 0;
          // store old resultDict[`${title}`] values if they exist
          if (resultDict[`${title}`]) {
            oldValue = resultDict[`${title}`].score;
            oldLength = resultDict[`${title}`].len;
          }
          // increment old score by new score
          scoreValue = oldValue + score[`${scoreType}`].value;
          // initialize resultDict[`${title}`]
          resultDict[`${title}`] = {
            score: 0,
            percentage: 0,
            len: 0,
            maxScore: 0,
            maxPercentage: scorePerspective.percentage,
          };

          resultDict[`${title}`].score += scoreValue;
          resultDict[`${title}`].len = oldLength + 1;
          resultDict[`${title}`].maxScore =
            resultDict[`${title}`].len * answerOptions.length;
          // calculate score as a percentage out of 25%
          resultDict[`${title}`].percentage =
            (resultDict[`${title}`].score / resultDict[`${title}`].maxScore) *
            resultDict[`${title}`].maxPercentage;
        }
      }
      // reset scoreValue to 0
      scoreValue = 0;
    }
    // // check if question is an appraisal A
    // if (score?.question?.description || score._qid == "AppraisalA") {
    //   const appraisalAScores = await Score.find({
    //     user: req.user,
    //     _qid: "AppraisalA",
    //     quarter: currentQuarter,
    //     session: currentSession,
    //   }).populate("user question score managerscore");
    //   console.log(`appraisalAScores length: ${appraisalAScores.length}`);
    //   const appraisalA = await AppraisalA.find();
    //   // let appraisalAScoreValue = 0
    //   appraisalACurrentScore = 0;
    //   // calculate appraisal A score
    //   for (const [key, score] of Object.entries(appraisalAScores)) {
    //     appraisalACurrentScore += score[`${scoreType}`]?.value;
    //     console.log("appraisalACurrentScore: " + appraisalACurrentScore);
    //     let appraisalAMaxScore = appraisalA.length * answerOptions.length;
    //     console.log("appraisalAMaxScore: ", appraisalAMaxScore);
    //     finalAppraisalAScore =
    //       (appraisalACurrentScore / appraisalAMaxScore) * 100;
    //   }
    // }
  }


  // calculate section A score
  const sectionA = await AppraisalA.find();
  const largestAnswerOption = await Option.findOne().sort("-value")

  const sectionALength = sectionA.length;  // get length of all section a questions
  const largestAnswerOptionValue = largestAnswerOption.value;  // get max value for section a options
  let sectionAMaxScore = sectionALength * largestAnswerOptionValue;  // calculate section a max score
  
  console.log("scoreType", scoreType)
  console.log("largestAnswerOption value, appraisalALength, sectionAMaxScore: ", largestAnswerOptionValue,  sectionALength, sectionAMaxScore)

  const sectionAScores = []  // list of scores for section a for a staff
  let sectionAScore = 0  // the section a score value


  for (const [index, instance] of Object.entries(sectionA)) {
    console.log("index: ", index)
    console.log("instance id: ", instance._id)

    // get the response (score) for each section a question
    const instanceScores = await Score.find({
      user: userId,
      question: instance._id,
      quarter: currentQuarter,
      session: currentSession,
    }).populate("score managerscore")

    // check if there are multiple responses (scores) for the same section a question
    if (instanceScores.length > 1) {
      // throw new ErrorResponse(`There are multiple responses for Appraisal A with id: ${instance._id}`)
      console.log(`There are multiple responses for Appraisal A with id: ${instance._id}`.red)
    }

    // get the first response (score) for a section a question
    let instanceScoreValue = await instanceScores[0][`${scoreType}`].value || 0
    console.log("instanceScoreValue", instanceScoreValue)

    // add the score value for the first response to a list
    sectionAScores.push(instanceScoreValue)
    // update the section a score value with the score value of the first response to the section a question
    sectionAScore += instanceScoreValue
  }

  console.log("sectionAScores", sectionAScores)

  console.log("sectionAScore", sectionAScore)

  // calculate the final score for section a
  const sectionAFinalScore = (sectionAScore / sectionAMaxScore) * 100;
  console.log("sectionAFinalScore", sectionAFinalScore)


  for (const [key, result] of Object.entries(resultDict)) {
    finalInitiativeScore += result?.percentage;
  }


  finalAppraisalAScore = sectionAFinalScore


  // const finalScore = (finalInitiativeScore + finalAppraisalAScore) / 2;
  const finalScore = finalInitiativeScore * 0.8 + finalAppraisalAScore * 0.2;

  if (finalResult) {
    finalResult.score = finalScore;
    finalResult.save();
  }
  // return finalScore;
  console.log("final score: ", finalScore)
  console.log("SomeBullShitToBreakTheCode")
  return {
    score: finalScore,
    sectionAScore: finalAppraisalAScore,
    sectionBScore: finalInitiativeScore,
  };
};

const ResultScoreUpdate = async (
  req,
  scoreType = "managerscore",
  finalResult = null
) => {
  // scoreType options are "score" or "managerscore"


  // get user id
  const userId = req.params.id ? req.params.id : req.user


  const { currentSession, currentQuarter } = await current();
  const userScores = await Score.find({
    user: req.params.id,
    quarter: currentQuarter,
    session: currentSession,
  }).populate("user question score managerscore");
  const answerOptions = await Option.find({});
  console.log(`answerOptions length: ${answerOptions.length}`);
  // check if there are any scores
  if (!userScores.length) {
    throw new ErrorResponse(
      "No scores found for this user in this quarter and session",
      404
    );
  }

  const allPerspectives = await Perspective.find();
  let perspectiveTitles = [];
  let scoreValue = 0;
  let resultDict = {};
  let finalInitiativeScore = 0;
  let finalAppraisalAScore = 0;
  let appraisalACurrentScore = 0;

  // create a list of perspective titles
  for (const [key, perspective] of Object.entries(allPerspectives)) {
    perspectiveTitles.push(perspective?.title);
  }

  for (const [key, score] of Object.entries(userScores)) {
    // check if question is an initiative
    if (score?.question?.perspective || score._qid == "Initiative") {
      const question = await Initiative.findById(score?.question).populate(
        "perspective"
      );
      let scorePerspectiveTitle = question?.perspective?.title;

      for (let i = 0; i < perspectiveTitles.length; i++) {
        if (scorePerspectiveTitle == perspectiveTitles[i]) {
          const scorePerspective = await Perspective.findOne({
            title: scorePerspectiveTitle,
          });
          let title = perspectiveTitles[i];
          let oldValue = 0;
          let oldLength = 0;
          // store old resultDict[`${title}`] values if they exist
          if (resultDict[`${title}`]) {
            oldValue = resultDict[`${title}`].score;
            oldLength = resultDict[`${title}`].len;
          }
          // increment old score by new score
          scoreValue = oldValue + score[`${scoreType}`].value;
          // initialize resultDict[`${title}`]
          resultDict[`${title}`] = {
            score: 0,
            percentage: 0,
            len: 0,
            maxScore: 0,
            maxPercentage: scorePerspective.percentage,
          };

          resultDict[`${title}`].score += scoreValue;
          resultDict[`${title}`].len = oldLength + 1;
          resultDict[`${title}`].maxScore =
            resultDict[`${title}`].len * answerOptions.length;
          // calculate score as a percentage out of 25%
          resultDict[`${title}`].percentage =
            (resultDict[`${title}`].score / resultDict[`${title}`].maxScore) *
            resultDict[`${title}`].maxPercentage;
        }
      }
      // reset scoreValue to 0
      scoreValue = 0;
    }
    // // check if question is an appraisal A
    // if (score?.question?.description || score._qid == "AppraisalA") {
    //   const appraisalAScores = await Score.find({
    //     user: req.params.id,
    //     _qid: "AppraisalA",
    //     quarter: currentQuarter,
    //     session: currentSession,
    //   }).populate("user question score managerscore");
    //   console.log(`appraisalAScores length: ${appraisalAScores.length}`);
    //   // check if there are any appraisal A scores
    //   if (!appraisalAScores.length) {
    //     throw new ErrorResponse(
    //       "No Section A scores found for this user in this quarter and session",
    //       404
    //     );
    //   }

    //   const appraisalA = await AppraisalA.find();
    //   // let appraisalAScoreValue = 0
    //   appraisalACurrentScore = 0;
    //   console.log(
    //     "appraisalACurrentScore, before updating: " + appraisalACurrentScore
    //   );
    //   // calculate appraisal A score
    //   for (const [key, score] of Object.entries(appraisalAScores)) {
    //     // check if score is valid
    //     if (!score[`${scoreType}`]) {
    //       throw new ErrorResponse(`${scoreType} not valid!`, 404);
    //     }

    //     appraisalACurrentScore += score[`${scoreType}`]?.value;
    //     console.log(`Appraisal A Score`, score);
    //     console.log(`Appraisal A ${scoreType}`, score[`${scoreType}`]);
    //     console.log("appraisalACurrentScore: " + appraisalACurrentScore);
    //     let appraisalAMaxScore = appraisalA.length * answerOptions.length;
    //     console.log("appraisalAMaxScore: ", appraisalAMaxScore);
    //     finalAppraisalAScore =
    //       (appraisalACurrentScore / appraisalAMaxScore) * 100;
    //   }
    // }
  }


  // calculate section A score
  const sectionA = await AppraisalA.find();
  const largestAnswerOption = await Option.findOne().sort("-value")

  const sectionALength = sectionA.length;  // get length of all section a questions
  const largestAnswerOptionValue = largestAnswerOption.value;  // get max value for section a options
  let sectionAMaxScore = sectionALength * largestAnswerOptionValue;  // calculate section a max score
  
  console.log("scoreType", scoreType)
  console.log("largestAnswerOption value, appraisalALength, sectionAMaxScore: ", largestAnswerOptionValue,  sectionALength, sectionAMaxScore)

  const sectionAScores = []  // list of scores for section a for a staff
  let sectionAScore = 0  // the section a score value


  for (const [index, instance] of Object.entries(sectionA)) {
    console.log("index: ", index)
    console.log("instance id: ", instance._id)

    // get the response (score) for each section a question
    const instanceScores = await Score.find({
      user: userId,
      question: instance._id,
      quarter: currentQuarter,
      session: currentSession,
    }).populate("score managerscore")

    // check if there are multiple responses (scores) for the same section a question
    if (instanceScores.length > 1) {
      // throw new ErrorResponse(`There are multiple responses for Appraisal A with id: ${instance._id}`)
      console.log(`There are multiple responses for Appraisal A with id: ${instance._id}`.red)
    }

    // get the first response (score) for a section a question
    let instanceScoreValue = await instanceScores[0][`${scoreType}`].value || 0
    console.log("instanceScoreValue", instanceScoreValue)

    // add the score value for the first response to a list
    sectionAScores.push(instanceScoreValue)
    // update the section a score value with the score value of the first response to the section a question
    sectionAScore += instanceScoreValue
  }

  console.log("sectionAScores", sectionAScores)

  console.log("sectionAScore", sectionAScore)

  // calculate the final score for section a
  const sectionAFinalScore = (sectionAScore / sectionAMaxScore) * 100;
  console.log("sectionAFinalScore", sectionAFinalScore)


  for (const [key, result] of Object.entries(resultDict)) {
    finalInitiativeScore += result?.percentage;
  }

  
  finalAppraisalAScore = sectionAFinalScore


  // const finalScore = (finalInitiativeScore + finalAppraisalAScore) / 2;
  const finalScore = finalInitiativeScore * 0.8 + finalAppraisalAScore * 0.2;

  if (finalResult) {
    finalResult.score = finalScore;
    finalResult.save();
  }
  // return finalScore;
  return {
    score: finalScore,
    sectionAScore: finalAppraisalAScore,
    sectionBScore: finalInitiativeScore,
  };
};

module.exports = {
  calculateScore,
  ResultScore,
  ResultScoreUpdate,
};
