// routes/submissions.js
const express = require("express");
const router = express.Router();
const { createSubmission, getSubmissionsByProblem } = require("../controllers/submissionController");

router.post("/", createSubmission);
router.get("/:problemId", getSubmissionsByProblem);

module.exports = router;
