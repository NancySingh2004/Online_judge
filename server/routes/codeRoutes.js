const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/submit", async (req, res) => {
  const { sourceCode, languageId, stdin } = req.body;

  try {
    const submissionRes = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
        redirect_stderr_to_stdout: true
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }
      }
    );

    const token = submissionRes.data.token;

    // Wait and get the result
    setTimeout(async () => {
      const result = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );

      res.json(result.data);
    }, 3000);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Code execution failed" });
  }
});


module.exports = router;
