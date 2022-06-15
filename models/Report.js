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

// ReportSchema.statics.getOverallScore = async function (id) {
//   const report = await this.findById(id);

//   console.log(report, "report");
// };

// ReportSchema.post("save", async function (next) {
//   console.log("post updateOne");
//   this.constructor.getOverallScore(this._id);
//   // this.overall =
//   //   (this[`First Quarter`] +
//   //     this[`Second Quarter`] +
//   //     this[`Third Quarter`] +
//   //     this[`Fourth Quarter`]) /
//   //   4;
//   next();
// });
ReportSchema.post("updateOne", async function (next) {
  console.log("post updateOnenew");

  this.overall =
    (this[`First Quarter`] +
      this[`Second Quarter`] +
      this[`Third Quarter`] +
      this[`Fourth Quarter`]) /
    4;

  console.log(
    this.overall,
    this.staff,
    this[`First Quarter`],
    this[`Second Quarter`]
  );
  // next();
});

module.exports = model("Report", ReportSchema);
