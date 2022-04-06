const mongoose = require("mongoose");

const SectionAResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Staff",
    required: true,
  },
  score: {
    type: Number,
  },
  managerscore: {
    type: Number,
  },
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
    required: [true, "Please add  status"],
    enum: ["Pending", "Started", "Completed"],
    default: "Started",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SectionAResult", SectionAResultSchema);
