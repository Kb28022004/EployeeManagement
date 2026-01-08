const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
  },
  fullName: String,
  gender: String,
  dob: Date,
  state: String,
  profileImage: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
