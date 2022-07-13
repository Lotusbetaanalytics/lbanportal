const {hrEmail} = require("./utils")
const sendEmail = require("./sendEmail")


exports.staffRegistrationEmail = async (staff) => {
  /**
   * @summary
   *  send email to hr to set a new staff's line manager
   * 
   * @param staff - staff instance of newly registered staff
   * 
   * @returns boolean
   */
  try {
    const subject = "Staff Line Manager"
    const salutation = `Dear HR,`
    const content = `
    Kindly be aware that ${
      staff.fullname
    }  has registered on the <a href="https://performance-portal.vercel.app/">Performance Portal</a>.
    Kindly setup their line manager at <a href="https://performance-portal.vercel.app/?id=${
      staff._id
    }">https://performance-portal.vercel.app/</a> on the <a href="https://performance-portal.vercel.app/">Portal</a>.
    `
    await sendEmail({
      email: [hrEmail],
      // cc: [staff.email],
      subject,
      salutation,
      content,
    })
    return true
  } catch (err) {
    console.log(err);
    return false
  }
}