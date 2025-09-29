const User = require("../models/User");
const Submission = require("../models/Submission");
const moment = require("moment");

// ---------------- Get Profile ----------------
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      github: user.github || "",
      linkedin: user.linkedin || "",
      bio: user.bio || "",
      role: user.role || "user",
      createdAt: user.createdAt,
      attendance: user.attendance || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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

// ---------------- Update Profile ----------------
const updateProfile = async (req, res) => {
  try {
    const { name, email, github, linkedin, bio } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name;
    user.email = email;
    user.github = github || "";
    user.linkedin = linkedin || "";
    user.bio = bio || "";

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      github: user.github,
      linkedin: user.linkedin,
      bio: user.bio,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed", error: err.message });
  }
};
// ---------------- Mark Attendance ----------------
const markAttendance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = moment().format("YYYY-MM-DD");
    const alreadyMarked = user.attendance.some(a => a.date === today);

    if (alreadyMarked) return res.status(400).json({ message: "Attendance already marked for today" });

    user.attendance.push({ date: today, attended: true });
    await user.save();

    res.json({ message: "Attendance marked successfully", attendance: user.attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};





module.exports = {
  getProfile,
  getSubmissions,
  updateProfile,
  markAttendance,
};
