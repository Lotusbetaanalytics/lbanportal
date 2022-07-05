const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const db = require("./config/db");

// load models
const Staff = require("./models/Staff");
const Appraisal = require("./models/Appraisal");
const Initiative = require("./models/Initiative");
const AppraisalA = require("./models/AppraisalA");
const Result = require("./models/Result");
const Score = require("./models/Score");
const Perspective = require("./models/Perspective");
const Calibration = require("./models/Calibration");
const Department = require("./models/Department");
const Option = require("./models/Option");
const SectionAResult = require("./models/SectionAResult");
const Log = require("./models/Log");
const { firstName } = require("./utils/utils");

dotenv.config();  // load config variables
db();  // connect to db


exports.getFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`
}

exports.createModelInstances = async (model, arr, is_file = false, is_json = false) => {
  /**
   * 
   */
	arr = is_file ? fs.readFileSync(arr, "utf-8") : arr;
	arr = is_json ? JSON.parse(arr) : arr;

	console.log("Creating Instances".green);
	instances = await model.insertMany(arr);
	console.log("Instances Created".bgGreen);
	return instances;
};

exports.deleteModelInstances = async (model, filter = {}) => {
	console.log("Deleting Instances".red);
	instances = await model.deleteMany(filter);
	console.log("Instances Deleted".bgRed);
	return instances;
};
