const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/authController");
const { getSubmissions } = require("../controllers/userController");

router.get("/me", authenticate, getProfile);
router.get("/submissions", authenticate, getSubmissions);

module.exports = router;
