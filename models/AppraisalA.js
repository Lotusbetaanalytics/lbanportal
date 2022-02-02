const mongoose = require("mongoose");

const AppraisalASchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  section: {
    type: String,
    default: "A",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("AppraisalA", AppraisalASchema);