const Staff = require("../models/Staff")
const sendEmail = require("./sendEmail")
const {convertQuarter, firstName, hrEmail} = require("./utils")

const createResultEmail = async (req, existingResult, result, hrEmail) => {
  const userDetails = await Staff.findById(result.user).populate("manager")
  
  // Send email to staff
  try {
    let salutation = ``
    let content = `
    Kudos, you have completed your ${convertQuarter(existingResult.quarter)} performance appraisal and you score is ${result.score}.
    Your manager will be informed to proceed with the manager rating.<br>
    
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
    // let managerFirstName = firstName(userDetails.manager.fullname)
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
}

const updateResultEmail = async (req, existingResult, result, hrEmail) => {
  const userDetails = await Staff.findById(result.user).populate("manager")

  if (existingResult.score != req.body.score) {
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
  
  if (existingResult.managerscore != req.body.managerscore) {
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
}

module.exports = {createResultEmail, updateResultEmail}