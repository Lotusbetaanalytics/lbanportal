const mongoose = require("mongoose");

const PerspectiveSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  percentage: {
    type: Number,
    max: 25,
    required: true,
  },
});

module.exports = mongoose.model("Perspective", PerspectiveSchema);
