const Department = require("../models/Department");
const { ErrorResponse } = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail")
const {hrEmail} = require("../utils/utils")

const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);


    const departmentManager = await Department.findById(department._id).populate("manager")


  // Send email to staff, manager and hr

      let salutation = ``;
      let content = `
      Hello ${departmentManager?.fullname??"Guest"}! This is to notify you that you have been assigned the manager of ${department.name} department.
      `;
      await sendEmail({
        email: departmentManager?.manager?.email,
        cc: [hrEmail],
        subject: "Department Update",
        salutation,
        content,
      });




    return res.status(201).json({
      success: true,
      data: department,
    });
  } catch (err) {
    return next(new ErrorResponse(`Error: ${err.message}`, 500));
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    ).populate("manager");

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (err) {
    return next(new ErrorResponse(`Error: ${err.message}`, 500));
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({}).populate("manager");
    return res.status(200).json({
      success: true,
      results: departments,
    });
  } catch (err) {
    return next(new ErrorResponse(`Error: ${err.message}`, 500));
  }
};

const removeDepartment = async (req, res, next) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return next(new ErrorResponse(`Error: ${err.message}`, 500));
  }
};

module.exports = {
  createDepartment,
  updateDepartment,
  getDepartments,
  removeDepartment,
};
