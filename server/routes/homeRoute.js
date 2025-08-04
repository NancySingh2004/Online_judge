const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Online Judge System' });
});

module.exports = router;
