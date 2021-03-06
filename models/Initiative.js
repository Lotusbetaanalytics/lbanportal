const mongoose = require("mongoose");

const InitiativeSchema = new mongoose.Schema({
  perspective: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Perspective",
  },
  objective: {
    type: String,
  },
  measures: {
    type: String,
    enum: ["Quarterly", "Annual", "Monthly", "Bi-annual"],
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
  result: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Result",
  },
  year: {
    type: String,
    // required: true,
  },
  section: {
    type: String,
    default: "B",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

InitiativeSchema.pre("remove", async function (next) {
  console.log("Deleting Section B Scores ...".brightblue);
  await this.model("Score").deleteMany({question: this._id});
  console.log("Section B Scores Deleted".bgRed);
  next();
});

module.exports = mongoose.model("Initiative", InitiativeSchema);
