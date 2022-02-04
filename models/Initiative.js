const mongoose = require("mongoose");
const Result = require('./Result')
const current = require("../utils/currentAppraisalDetails")

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
  result: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Result",
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


InitiativeSchema.pre("save", async function (next) {
  const {currentSession, currentQuarter} = await current()

  if (currentSession && currentQuarter) {
    defaultResult = await Result.create({session: this.session, quarter: currentQuarter, user: this.user})
    this.result = defaultResult.id
  }
})

module.exports = mongoose.model("Initiative", InitiativeSchema);
