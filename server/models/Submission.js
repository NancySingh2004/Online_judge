const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  problemName: String,
  language: String,
  sourceCode: String,
  verdict: String,
  results: Array,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
