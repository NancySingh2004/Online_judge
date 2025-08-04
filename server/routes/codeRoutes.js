const express = require('express');
const router = express.Router();
const { executeCode } = require('../codeExecutor');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

router.post('/submit', async (req, res) => {
  const {
    language = 'python',
    sourceCode,
    testCases = [], // ⬅️ Array of test cases
    problem_name = 'Untitled Problem',
    userId = null,
    save = false,
  } = req.body;

  // ✅ Basic validation
  if (!sourceCode || typeof sourceCode !== 'string') {
    return res.status(400).json({ error: 'Source code is required.' });
  }

  if (!Array.isArray(testCases) || testCases.length === 0) {
    return res.status(400).json({ error: 'At least one test case is required.' });
  }

  const results = [];

  for (const { input = '', expectedOutput = '' } of testCases) {
    try {
      const rawOutput = await executeCode(language, sourceCode, input);
      const actual = rawOutput.trim().replace(/\s+$/, '');
      const expected = expectedOutput.trim().replace(/\s+$/, '');
      const verdict = actual === expected ? "Accepted" : "Wrong Answer";

      results.push({
        input,
        expected: expectedOutput,
        output: actual,
        verdict,
      });

      // ✅ Save submission if needed
      if (save) {
        await Submission.create({
          userId,
          problem_name,
          code: sourceCode,
          language,
          stdin: input,
          output: actual,
          verdict,
        });
      }
    } catch (err) {
      const errorMsg = err.error || 'Execution failed';
      const runtimeOutput = err.details || '';

      results.push({
        input,
        expected: expectedOutput,
        output: runtimeOutput,
        verdict: "Runtime Error",
      });

      // ✅ Save runtime error
      if (save) {
        await Submission.create({
          userId,
          problem_name,
          code: sourceCode,
          language,
          stdin: input,
          output: runtimeOutput,
          verdict: "Runtime Error",
        });
      }
    }
  }

  res.json({ results });
});

module.exports = router;
