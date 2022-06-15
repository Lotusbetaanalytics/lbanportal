const mongoose = require("mongoose");

const AppraisalSchema = new mongoose.Schema({
  session: {
    type: String,
    required: [true, "Please add sesssion"],
  },
  quarter: {
    type: String,
    required: [true, "Please add  Quarter"],
    enum: [
      "First Quarter",
      "Second Quarter",
      "Third Quarter",
      "Fourth Quarter",
    ],
  },
  status: {
    type: String,
    enum: ["Pending", "Started", "Stopped", "Completed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appraisal", AppraisalSchema);
