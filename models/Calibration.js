const mongoose = require("mongoose");

const CalibrationSchema = new mongoose.Schema({
  hr: {
    type: mongoose.Schema.ObjectId,
    ref: "Staff",
    required: true,
  },
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: "Staff",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Calibration", CalibrationSchema);
