const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Option", OptionSchema);
