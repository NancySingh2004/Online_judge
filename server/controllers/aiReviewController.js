const axios = require("axios");

const getAIReview = async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    res.status(200).json({ aiReply });
  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "AI review failed. Please try again later." });
  }
};

module.exports = { getAIReview };
