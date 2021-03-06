const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: [true, "Please add a Score"],
  },
  sectionascore: {
    type: Number,
  },
  sectionbscore: {
    type: Number,
  },
  managerscore: {
    type: Number,
    default: 0,
  },
  sectionamanagerscore: {
    type: Number,
  },
  sectionbmanagerscore: {
    type: Number,
  },
  overall: {
    type: Number,
  },
  hr: {
    type: Number,
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
  status: {
    type: String,
    required: [true, "Please add  status"],
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Staff",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Result", ResultSchema);
