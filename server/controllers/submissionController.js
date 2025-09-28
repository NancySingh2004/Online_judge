const Submission = require("../models/Submission");

exports.createSubmission = async (req, res) => {
  try {
    const submission = new Submission(req.body);
    await submission.save();
     // Emit event to Socket.IO for real-time graph
    const io = req.app.get("io");
    io.emit("new_submission", {
      userId: req.body.userId, // ensure you have userId in submission
      total_solved: req.body.total_solved || 1, // update according to your logic
      submittedAt: submission.submittedAt
    });
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
