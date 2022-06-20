const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
  },
  manager: {
    type: mongoose.Schema.ObjectId,
    ref: "Staff",
    required: [true, "Please add a manager"],
  },
});

module.exports = mongoose.model("Department", departmentSchema);
