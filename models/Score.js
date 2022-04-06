const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Staff",
    required: true,
  },
  question: {
    type: mongoose.Schema.ObjectId,
    refPath: "_qid",
    required: true,
  },
  _qid: {
    type: String,
    enum: ["AppraisalA", "Initiative"],
    required: true,
  },
  score: {
    type: mongoose.Schema.ObjectId,
    ref: "Option",
    required: true,
  },
  managerscore: {
    type: mongoose.Schema.ObjectId,
    ref: "Option",
    // required: true,
  },
  section: {
    type: String,
    enum: ["A", "B"],
  },
  session: {
    type: String,
    required: [true, "Please add Session"],
  },
  quarter: {
    type: String,
    required: [true, "Please add Quarter"],
    enum: [
      "First Quarter",
      "Second Quarter",
      "Third Quarter",
      "Fourth Quarter",
    ],
  },
});

module.exports = mongoose.model("Score", ScoreSchema);
