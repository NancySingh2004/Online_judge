const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: userMessage }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand.";
    res.json({ reply: botReply });

  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

module.exports = router;
