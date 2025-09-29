const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 6,
    },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    bio: { type: String, default: "" },
    role: { type: String, default: "user" },
   
    // ✅ New field for attendance/streak tracking
    attendance: [
      {
        date: { type: String },  // store as 'YYYY-MM-DD'
        attended: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
