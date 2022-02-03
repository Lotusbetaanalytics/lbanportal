const mongoose = require("mongoose");

const InitiativeSchema = new mongoose.Schema({
  perspective: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Perspective",
  },

  measures: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  initiative: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Staff",
  },
  year: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Initiative", InitiativeSchema);
