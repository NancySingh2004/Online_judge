const express = require("express");
const { registerUser, login, getProfile } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", getProfile);

module.exports = router;
