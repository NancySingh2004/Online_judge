const Submission = require("../models/Submission");

exports.createSubmission = async (req, res) => {
  try {
    const submission = new Submission(req.body);
    await submission.save();
    res.status(201).json({ message: "Submission saved", submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubmissionsByProblem = async (req, res) => {
  try {
    const submissions = await Submission.find({ problemId: req.params.problemId }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
