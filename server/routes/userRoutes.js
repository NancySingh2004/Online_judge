const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/authController");
const { getSubmissions, updateProfile, markAttendance } = require("../controllers/userController");



router.get("/me",authenticate, getProfile);
router.get("/submissions", authenticate,  getSubmissions);
router.put("/update", authenticate,  updateProfile);
router.put("/markAttendance", authenticate, markAttendance); 

module.exports = router;
