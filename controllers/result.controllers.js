const Result = require("../models/Result")
const Staff = require("../models/Staff")
const current = require("../utils/currentAppraisalDetails")
const resultScore = require("../utils/calculateScore")
const sendEmail = require("../utils/sendEmail")
const firstName = require("../utils/getFirstName")
const convertQuarter = require("../utils/convertQuarter")

//Create a result
const createResult = async (req, res) => {
  const {currentSession, currentQuarter} = await current()

  try {
    let { user, body } = req;
    const {session, quarter} = body

    const existingResult = await Result.find({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter
    });
    if (existingResult.length > 0) {
      res.status(200).json({
        success: true,
        msg: "Result already exists",
      });
    }

    const score = await resultScore(req)

    if (!session || !quarter) {
      body.session = currentSession
      body.quarter = currentQuarter
    }
    body.user = user
    body.score = score

    const result = await Result.create(body);

    const userDetails = await Staff.findById(user.id).populate("manager")

    // Send email to staff
    try {
      let salutation = ``
      let content = `
      Kudos, you have completed your ${convertQuarter(existingResult.quarter)} performance appraisal and you score is ${result.score}.
      Your manager will be informed to proceed with the manager rating
      
      Thank you
      `
      await sendEmail({
        email: userDetails.email,
        subject: "Completed Quarterly Appraisal",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err)
    }
    
    // Send email to staff's manager
    try {
      let managerFirstName = firstName(userDetails.manager.fullname)
      let managerEmail = userDetails.manager.email
      let salutation = `Dear Manager,`
      let content = `
      Kindly be aware that ${userDetails.fullname}  has completed the self-appraisal section of the ${convertQuarter(existingResult.quarter)} performance appraisal with an overall score of ${result.score}. 
      Kindly log on to the <a href="https://lbanstaffportal.herokuapp.com/dashboard">Portal</a> for your final rating.
      `
      await sendEmail({
        email: managerEmail,
        subject: "Quarterly Appraisal for Team Member",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err)
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all results
const getAllResult = async (req, res) => {
  try {
    const result = await Result.find({})
      .populate({
        path: "user",
        select: "fullname email department manager role isManager"
      });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found!" });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get the current appraisal result for an authenticated staff
const getCurrentResult = async (req, res) => {
  try {
    const {currentSession, currentQuarter} = await current()

    const result = await Result.findOne({
      user: req.user,
      session: currentSession,
      quarter: currentQuarter,
    }).populate({
        path: "user",
        select: "fullname email department manager role isManager"
      });

    if (!result) {
      return res
        .status(400)
        .json({ success: false, msg: "Result not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get all results by quarter for an authenticated staff
const getQuarterlyResult = async (req, res) => {
  try {
    const {currentSession} = await current()

    const staff = await Staff.findById(req.user)
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
    if (!firstQuarterResult || !secondQuarterResult || !thirdQuarterResult || !fourthQuarterResult) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found!" });
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
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get the current appraisal result for a staff
const getCurrentResultByStaffId = async (req, res) => {
  try {
    const {currentSession, currentQuarter} = await current()

    const staff = await Staff.findById(req.params.id)
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
    if (!firstQuarterResult || !secondQuarterResult || !thirdQuarterResult || !fourthQuarterResult) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found!" });
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
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//update the current appraisal result for a staff using staff id
const UpdateCurrentResultByStaffId = async (req, res) => {
  try {
    const {currentSession, currentQuarter} = await current()
    const { body } = req;

    const staff = await Staff.findById(req.params.id)
    const existingResult = await Result.find({
      user: req.params.id,
      session: currentSession,
      quarter: currentQuarter,
    });
    const score = await resultScore(req)
    const managerScore = await resultScore(req, scoreType="managerscore")
    const hrEmail = "akinwalejude@gmail.com"
    body.score = score
    body.managerscore = managerScore

    if (!existingResult) {
      return res
        .status(404)
        .json({ success: false, msg: "Results not found!" });
    }

    const result = await Result.findByIdAndUpdate(existingResult.id, req.body, {
      new: true,
      runValidators: true,
    });

    const userDetails = await Staff.findById(result.user)

    if (existingResult.score != body.score) {
      // Send email to staff
      try {
        let salutation = ``
        let content = `
        Kudos, you have updated your ${convertQuarter(existingResult.quarter)} performance appraisal and you score is ${result.score}.,
        Your manager will be informed to proceed with the manager rating
        
        Thank you
        `
        await sendEmail({
          email: userDetails.email,
          cc: [hrEmail],
          subject: "Upated Quarterly Appraisal",
          salutation,
          content,
        });
      } catch (err) {
        console.log(err)
      }

      // Send email to staff's manager
      try {
        // let managerFirstName = firstName(userDetails.manager.fullname)
        salutation = `Dear Manager,`
        content = `
        Kindly be aware that (name of staff member)  has updated the self-appraisal section of the ${convertQuarter(existingResult.quarter)} performance appraisal with an overall score of ${result.score}., 
        Kindly log on to the <a href="https://lbanstaffportal.herokuapp.com/dashboard">Portal</a> for your final rating.
        `
        await sendEmail({
          email: userDetails.manager.email,
          cc: [hrEmail],
          subject: "Quarterly Appraisal for Team Member",
          salutation,
          content,
        });
      } catch (err) {
        console.log(err)
      }


      
    }
    
    if (existingResult.managerscore != body.managerscore) {
      // Send email to staff
      try {
        let salutation = ``
        let content = `
        Kindly be aware that your manager has rated your ${convertQuarter(existingResult.quarter)} performance appraisal and your manager's score is ${result.managerscore}.
        
        Thank you
        `
        await sendEmail({
          email: userDetails.email,
          cc: [hrEmail],
          subject: "Upated Quarterly Appraisal",
          salutation,
          content,
        });
      } catch (err) {
        console.log(err)
      }

      // Send email to staff's manager
      try {
        // let managerFirstName = firstName(userDetails.manager.fullname)
        salutation = `Dear Manager,`
        content = `
        Kindly be aware that the manager's rating score for ${existingResult.user.fullname} for the ${convertQuarter(existingResult.quarter)} performance appraisal is ${result.managerscore}, 
        
        Thank you
        `
        await sendEmail({
          email: userDetails.manager.email,
          cc: [hrEmail],
          subject: "Quarterly Appraisal for Team Member",
          salutation,
          content,
        });
      } catch (err) {
        console.log(err)
      }
      
    }
    
    res.status(200).json({
      success: true,
      data: result,
      staff: staff,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Get a result's details
const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({
        path: "user",
        select: "fullname email department manager role isManager"
      });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, msg: "Result not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Upadate a result's details
const updateResult = async (req, res) => {
  try {
    const { body } = req;
    const existingResult = await Result.findById(req.params.id).populate("user")
    const score = await resultScore(req)
    const managerScore = await resultScore(req, scoreType="managerscore")
    const hrEmail = "akinwalejude@gmail.com"
    body.score = score
    body.managerscore = managerScore

    const result = await Result.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const userDetails = await Staff.findById(result.user)

    if (existingResult.score != body.score) {
      // Send email to staff
      try {
        let salutation = ``
        let content = `
        Kudos, you have updated your ${convertQuarter(existingResult.quarter)} performance appraisal and you score is ${result.score}.,
        Your manager will be informed to proceed with the manager rating
        
        Thank you
        `
        await sendEmail({
          email: userDetails.email,
          cc: [hrEmail],
          subject: "Upated Quarterly Appraisal",
          salutation,
          content,
        });
      } catch (err) {
        console.log(err)
      }

      // Send email to staff's manager
      try {
        // let managerFirstName = firstName(userDetails.manager.fullname)
        salutation = `Dear Manager,`
        content = `
        Kindly be aware that (name of staff member)  has updated the self-appraisal section of the ${convertQuarter(existingResult.quarter)} performance appraisal with an overall score of ${result.score}., 
        Kindly log on to the <a href="https://lbanstaffportal.herokuapp.com/dashboard">Portal</a> for your final rating.
        `
        await sendEmail({
          email: userDetails.manager.email,
          cc: [hrEmail],
          subject: "Quarterly Appraisal for Team Member",
          salutation,
          content,
        });
      } catch (err) {
        console.log(err)
      }


      
    }
    
    if (existingResult.managerscore != body.managerscore) {
      // Send email to staff
      try {
        let salutation = ``
        let content = `
        Kindly be aware that your manager has rated your ${convertQuarter(existingResult.quarter)} performance appraisal and your manager's score is ${result.managerscore}.
        
        Thank you
        `
        await sendEmail({
          email: userDetails.email,
          cc: [hrEmail],
          subject: "Upated Quarterly Appraisal",
          salutation,
          content,
        });
      } catch (err) {
        console.log(err)
      }

      // Send email to staff's manager
      try {
        // let managerFirstName = firstName(userDetails.manager.fullname)
        salutation = `Dear Manager,`
        content = `
        Kindly be aware that the manager's rating score for ${existingResult.user.fullname} for the ${convertQuarter(existingResult.quarter)} performance appraisal is ${result.managerscore}, 
        
        Thank you
        `
        await sendEmail({
          email: userDetails.manager.email,
          cc: [hrEmail],
          subject: "Quarterly Appraisal for Team Member",
          salutation,
          content,
        });
      } catch (err) {
        console.log(err)
      }
      
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

//Delete a result
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, msg: "Result not found!" });
    }
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

module.exports = {
  createResult,
  getAllResult,
  getCurrentResult,
  getQuarterlyResult,
  getCurrentResultByStaffId,
  UpdateCurrentResultByStaffId,
  getResult,
  updateResult,
  deleteResult
}