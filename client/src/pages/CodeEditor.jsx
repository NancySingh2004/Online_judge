import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const CodeEditor = () => {
  const [sourceCode, setSourceCode] = useState("");
  const [output, setOutput] = useState("");
  const [languageId, setLanguageId] = useState(71); // Default: Python

  const handleSubmit = async () => {
    setOutput("Running...");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/code/submit`, {
        sourceCode,
        languageId,
        stdin: ""
      });

      setOutput(res.data.stdout || res.data.stderr || res.data.compile_output);
    } catch (err) {
      console.error(err);
      setOutput("Error during execution");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Online Judge</h2>

      {/* Language Selector */}
      <select
        className="border p-2 mt-4"
        value={languageId}
        onChange={(e) => setLanguageId(Number(e.target.value))}
      >
        <option value={71}>Python (3.8.1)</option>
        <option value={54}>C++ (GCC 9.2)</option>
        <option value={62}>Java (OpenJDK 13)</option>
        <option value={63}>JavaScript (Node.js 12.14)</option>
        <option value={50}>C (GCC 9.2)</option>
      </select>

      <textarea
        rows="10"
        className="w-full border p-2 mt-4"
        placeholder="Write your code here..."
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
      ></textarea>

      <div className="mt-4">
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Code
        </button>
      </div>

      <div className="mt-4">
        <h4 className="font-bold">Output:</h4>
        <pre className="bg-gray-100 p-2">{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
