const mongoose = require("mongoose");

const PerspectiveSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    default: 25,
    required: true
  }
});

module.exports = mongoose.model("Perspective", PerspectiveSchema);
