const Department = require("../models/Department");
const { ErrorResponse } = require("../utils/errorResponse");

const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
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
