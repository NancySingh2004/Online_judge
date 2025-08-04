const User = require("../models/User");
const Submission = require("../models/Submission");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Destructure only the fields you want to send to the frontend
    const { _id, full_name, user_id, email, role, createdAt } = user;

    res.status(200).json({
      _id,
      full_name,
      user_id,
      email,
      role,
      createdAt,
    });
  } catch (err) {
    console.error("Error in getProfile:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.json(submissions);
  } catch (err) {
    console.error("Fetch Submissions Error:", err.message);
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};


module.exports = {
  getProfile,
  getSubmissions
};
