import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CodeEditor = () => {
  const [language, setLanguage] = useState("python");
  const [sourceCode, setSourceCode] = useState(`print("Hello from Python!")`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    setOutput("⏳ Running...");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/code/submit`, {
       language,
       sourceCode,  // ✅ matches backend
       stdin: input
      });
      setOutput(res.data.output || "⚠️ No output received.");
    } catch (err) {
      console.error("❌ Error:", err);
      const msg = err.response?.data?.error || "Server error";
      setOutput(`❌ ${msg}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💻 Docker Code Executor</h2>

      <label className="block mb-2 font-semibold">Select Language:</label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="python">Python</option>
      </select>

      <label className="block mb-2 font-semibold">Code:</label>
      <textarea
        rows="10"
        className="w-full border p-2 rounded mb-4 font-mono"
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
      />

      <label className="block mb-2 font-semibold">Input (stdin):</label>
      <textarea
        rows="3"
        className="w-full border p-2 rounded mb-4 font-mono"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🚀 Run Code
      </button>

      <div className="mt-6">
        <h4 className="font-bold">🧾 Output:</h4>
        <pre className="bg-gray-100 border p-4 rounded whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
