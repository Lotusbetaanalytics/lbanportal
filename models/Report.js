const { model, Schema } = require("mongoose");

const ReportSchema = new Schema({
  "First Quarter": {
    type: Number,
    default: 0,
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
  },
  staffName: {
    type: String,
  },
  "Second Quarter": {
    type: Number,
    default: 0,
  },
  "Third Quarter": {
    type: Number,
    default: 0,
  },
  "Fourth Quarter": {
    type: Number,
    default: 0,
  },
  overall: {
    type: Number,
    default: 0,
  },
  session: {
    type: String,
  },
  department: {
    type: String,
  },
  calibration: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Report", ReportSchema);
