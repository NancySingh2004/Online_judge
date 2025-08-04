const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    problem_name: {
      type: String,
      default: "Untitled Problem",
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["python", "cpp", "c", "java", "node", "ruby"],
    },
    stdin: {
      type: String,
      default: "",
    },
    output: {
      type: String,
      default: "",
    },
    verdict: {
      type: String,
      enum: ["Accepted", "Runtime Error", "Compilation Error", "Time Limit Exceeded"],
      default: "Accepted",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
