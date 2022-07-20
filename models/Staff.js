const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  state: {
    type: String,
  },
  mobile: {
    type: String,
  },
  cug: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please add Email"],
    unique: true,
  },

  // this will be changed to a list of strings or ObjectId later
  department: {
    type: String,
  },
  // this will be the department manager
  departmentManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  // this is used as the "line manager" so i don't have to modify the logic 
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
  code: {
    type: String,
  },
  position: {
    type: String,
  },
  role: {
    type: String,
    enum: ["HR", "Admin", "Manager", "Staff", "Team Lead", "Line Manager"],
    default: "Staff",
  },
  roles: {
    type: [String],
  },
  isManager: {
    type: Boolean,
    default: false,
  },

  files: {
    type: Array,
  },

  location: {
    type: String,
  },
  photo: {
    type: String,
  },
  emergencyContactName: {
    type: String,
  },
  emergencyContactEmail: {
    type: String,
  },
  emergencyContactState: {
    type: String,
  },
  emergencyContactPhone: {
    type: String,
  },
  emergencyContactRelationship: {
    type: String,
  },
  emergencyContactAddress: {
    type: String,
  },
  calibrate: {
    type: Boolean,
    default: false,
  },
  resumptionDate: { type: String },
  bank: { type: String },
  accountName: { type: String },
  accountNumber: { type: String },
  nin: { type: String },
  bvn: { type: String },
  bio: { type: String },
  middleName: { type: String },
  branch: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

StaffSchema.pre("remove", async function (next) {
  console.log("Deleting Initiatives ...".brightblue);
  await this.model("Initiative").deleteMany({user: this._id});
  console.log("Initiatives Deleted".bgRed);

  console.log("Deleting Section A Results ...".brightblue);
  await this.model("SectionAResult").deleteMany({user: this._id});
  console.log("Section A Results Deleted".bgRed);

  console.log("Deleting Test Results ...".brightblue);
  await this.model("Result").deleteMany({user: this._id});
  console.log("Test Results Deleted".bgRed);
  next();
});

module.exports = mongoose.model("Staff", StaffSchema);
