const Staff = require("../models/Staff");
const sendEmail = require("./sendEmail");
const { convertQuarter, firstName, hrEmail } = require("./utils");

const createResultEmail = async (req, result, hrEmail) => {
  // Send email to staff
  const userDetails = await Staff.findById(req.user).populate("manager");
  try {
    let salutation = ``;
    let content = `
    Kudos, you have completed your ${convertQuarter(
      result.quarter
    )} performance appraisal and you score is ${result.score}.
    Your manager will be informed to proceed with the manager rating.<br>

    Thank you
    `;
    await sendEmail({
      email: userDetails.email,
      subject: "Completed Quarterly Appraisal",
      salutation,
      content,
    });
  } catch (err) {
    console.log(err);
  }

  // Send email to staff's manager
  try {
    // let managerFirstName = firstName(userDetails.manager.fullname)
    let managerEmail = userDetails.manager.email;
    let salutation = `Dear Manager,`;
    let content = `
    Kindly be aware that ${
      userDetails.fullname
    }  has completed the self-appraisal section of the ${convertQuarter(
      result.quarter
    )} performance appraisal with an overall score of ${result.score}.
    Kindly log on to the <a href="https://performance-portal.vercel.app/">Portal</a> for your final rating.
    `;
    await sendEmail({
      email: managerEmail,
      cc: [hrEmail],
      subject: "Quarterly Appraisal for Team Member",
      salutation,
      content,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateResultEmail = async (req, existingResult, result, hrEmail) => {
  const userDetails = await Staff.findById(result.user).populate("manager");

  if (existingResult.score != req.body.score) {
    // Send email to staff
    try {
      let salutation = ``;
      let content = `
      Kudos, you have updated your ${convertQuarter(
        result.quarter
      )} performance appraisal and you score is ${result.score}.,
      Your manager will be informed to proceed with the manager rating

      Thank you
      `;
      await sendEmail({
        email: userDetails.email,
        // cc: [hrEmail],
        subject: "Upated Quarterly Appraisal",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err);
    }

    // Send email to staff's manager
    try {
      // let managerFirstName = firstName(userDetails.manager.fullname)
      salutation = `Dear Manager,`;
      content = `
      Kindly be aware that ${
        userDetails.fullname
      }  has updated the self-appraisal section of the ${convertQuarter(
        result.quarter
      )} performance appraisal with an overall score of ${result.score}.,
      Kindly log on to the <a href="https://performance-portal.vercel.app/">Portal</a> for your final rating.
      `;
      await sendEmail({
        email: userDetails.manager.email,
        cc: [hrEmail],
        subject: "Quarterly Appraisal for Team Member",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (existingResult.managerscore != req.body.managerscore) {
    // Send email to staff
    try {
      let salutation = ``;
      let content = `
      Kindly be aware that your manager has rated your ${convertQuarter(
        result.quarter
      )} performance appraisal and your manager's score is ${
        result.managerscore
      }.
      <a href="https://performance-portal.vercel.app/report">View Result to accept or reject</a>

      Thank you
      `;
      await sendEmail({
        email: userDetails.email,
        // cc: [hrEmail],
        subject: "Upated Quarterly Appraisal",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err);
    }

    // Send email to staff's manager
    try {
      // let managerFirstName = firstName(userDetails.manager.fullname)
      salutation = `Dear Manager,`;
      content = `
      Kindly be aware that the updated manager's rating score for ${
        userDetails.fullname
      } for the ${convertQuarter(result.quarter)} performance appraisal is ${
        result.managerscore
      },

      Thank you
      `;
      await sendEmail({
        email: userDetails.manager.email,
        cc: [hrEmail],
        subject: "Updated Quarterly Appraisal for Team Member",
        salutation,
        content,
      });
    } catch (err) {
      console.log(err);
    }
  }
};

const rejectedResultEmail = async (req, result, hrEmail) => {
  const userDetails = await Staff.findById(result.user).populate("manager");

  // Send email to staff
  try {
    let salutation = ``;
    let content = `
    You have rejected your manager's score for the ${convertQuarter(
      result.quarter
    )} performance appraisal.
    Your self appraisal score is ${result.score} and your manager's score is ${
      result.managerscore
    }.
    Your manager will be informed to proceed with a review.<br>

    Thank you
    `;
    await sendEmail({
      email: userDetails.email,
      subject: "Rejected Manager Appraisal Score",
      salutation,
      content,
    });
  } catch (err) {
    console.log(err);
  }

  // Send email to staff's manager
  try {
    // let managerFirstName = firstName(userDetails.manager.fullname)
    let managerEmail = userDetails.manager.email;
    let salutation = `Dear Manager,`;
    let content = `
    Kindly be aware that ${
      userDetails.fullname
    }  has rejected the manager score section of the ${convertQuarter(
      result.quarter
    )} performance appraisal.
    The manager score is ${result.managerscore}.
    The staff's self appraisal score is ${result.score}.
    Kindly organize a review.
    `;
    await sendEmail({
      email: managerEmail,
      cc: [hrEmail],
      subject: "Rejected Manager Appraisal Score for Team Member",
      salutation,
      content,
    });
    manager;
  } catch (err) {
    console.log(err);
  }
};

const acceptedResultEmail = async (req, result, hrEmail) => {
  const userDetails = await Staff.findById(result.user).populate("manager");

  // Send email to staff, manager and hr
  try {
    let managerEmail = userDetails.manager.email;
    let salutation = ``;
    let content = `
    Kindly be aware that ${
      userDetails.fullname
    } has accepted the manager score of the ${convertQuarter(
      result.quarter
    )} performance appraisal.
    The overall score is ${result.overall}
    The manager score is ${result.managerscore}.
    The staff's self appraisal score is ${result.score}.
    `;
    await sendEmail({
      email: userDetails.email,
      cc: [managerEmail, hrEmail],
      subject: "Accepted Manager Appraisal Score",
      salutation,
      content,
    });
  } catch (err) {
    console.log(err);
  }
};
const assignedRoleEmail = async (req, hrEmail) => {
  const userDetails = await Staff.findById(req.params.id);

  // Send email to staff, manager and hr
  try {
    let salutation = ``;
    let content = `
    Hello ${userDetails.fullname}, kindly be aware that you have been assigned the role of a Manager.
    `;
    await sendEmail({
      email: userDetails.email,
      cc: [hrEmail],
      subject: "Role Assignment",
      salutation,
      content,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createResultEmail,
  updateResultEmail,
  rejectedResultEmail,
  acceptedResultEmail,
  assignedRoleEmail,
};
