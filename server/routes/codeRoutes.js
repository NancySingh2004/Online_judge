const express = require('express');
const router = express.Router();
const { executeCode } = require('../codeExecutor');

router.post('/submit', async (req, res) => {
  const { language = 'python', sourceCode, stdin = '' } = req.body;

  // ✅ Basic validation
  if (!sourceCode || typeof sourceCode !== 'string') {
    return res.status(400).json({ error: 'Source code is required.' });
  }

  try {
    const output = await executeCode(language, sourceCode, stdin);
    res.json({ output });
  } catch (err) {
    res.status(500).json({
      error: err.error || 'Execution failed',
      details: err.details || 'No additional details',
    });
  }
});

module.exports = router;
