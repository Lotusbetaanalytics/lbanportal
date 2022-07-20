const Score = require("../models/Score");
const Initiative = require("../models/Initiative");
const AppraisalA = require("../models/AppraisalA");
const Perspective = require("../models/Perspective");
const Option = require("../models/Option");
const current = require("./currentAppraisalDetails");
const { ErrorResponse } = require("./errorResponse");

const ResultScore = async (req, scoreType = "score", finalResult = null) => {
  // scoreType options are "score" or "managerscore"
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
    // check if question is an appraisal A
    if (score?.question?.description || score._qid == "AppraisalA") {
      const appraisalAScores = await Score.find({
        user: req.user,
        _qid: "AppraisalA",
        quarter: currentQuarter,
        session: currentSession,
      }).populate("user question score managerscore");
      console.log(`appraisalAScores length: ${appraisalAScores.length}`);
      const appraisalA = await AppraisalA.find();
      // let appraisalAScoreValue = 0
      appraisalACurrentScore = 0;
      // calculate appraisal A score
      for (const [key, score] of Object.entries(appraisalAScores)) {
        appraisalACurrentScore += score[`${scoreType}`]?.value;
        console.log("appraisalACurrentScore: " + appraisalACurrentScore);
        let appraisalAMaxScore = appraisalA.length * answerOptions.length;
        console.log("appraisalAMaxScore: ", appraisalAMaxScore);
        finalAppraisalAScore =
          (appraisalACurrentScore / appraisalAMaxScore) * 100;
      }
    }
  }

  for (const [key, result] of Object.entries(resultDict)) {
    finalInitiativeScore += result?.percentage;
  }
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

const ResultScoreUpdate = async (
  req,
  scoreType = "managerscore",
  finalResult = null
) => {
  // scoreType options are "score" or "managerscore"
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
    // check if question is an appraisal A
    if (score?.question?.description || score._qid == "AppraisalA") {
      const appraisalAScores = await Score.find({
        user: req.params.id,
        _qid: "AppraisalA",
        quarter: currentQuarter,
        session: currentSession,
      }).populate("user question score managerscore");
      console.log(`appraisalAScores length: ${appraisalAScores.length}`);
      // check if there are any appraisal A scores
      if (!appraisalAScores.length) {
        throw new ErrorResponse(
          "No Section A scores found for this user in this quarter and session",
          404
        );
      }

      const appraisalA = await AppraisalA.find();
      // let appraisalAScoreValue = 0
      appraisalACurrentScore = 0;
      console.log(
        "appraisalACurrentScore, before updating: " + appraisalACurrentScore
      );
      // calculate appraisal A score
      for (const [key, score] of Object.entries(appraisalAScores)) {
        // check if score is valid
        if (!score[`${scoreType}`]) {
          throw new ErrorResponse(`${scoreType} not valid!`, 404);
        }

        appraisalACurrentScore += score[`${scoreType}`]?.value;
        console.log(`Appraisal A Score`, score);
        console.log(`Appraisal A ${scoreType}`, score[`${scoreType}`]);
        console.log("appraisalACurrentScore: " + appraisalACurrentScore);
        let appraisalAMaxScore = appraisalA.length * answerOptions.length;
        console.log("appraisalAMaxScore: ", appraisalAMaxScore);
        finalAppraisalAScore =
          (appraisalACurrentScore / appraisalAMaxScore) * 100;
      }
    }
  }

  for (const [key, result] of Object.entries(resultDict)) {
    finalInitiativeScore += result?.percentage;
  }
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
  ResultScore,
  ResultScoreUpdate,
};
