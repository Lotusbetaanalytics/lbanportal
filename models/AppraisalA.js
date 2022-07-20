const mongoose = require("mongoose");

const AppraisalASchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  section: {
    type: String,
    default: "A",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AppraisalASchema.pre("remove", async function (next) {
  console.log("Deleting Section A Scores ...".brightblue);
  await this.model("Score").deleteMany({question: this._id});
  console.log("Section A Scores Deleted".bgRed);
  next();
});


module.exports = mongoose.model("AppraisalA", AppraisalASchema);
