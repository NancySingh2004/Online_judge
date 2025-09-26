// CodeEditor.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlay,
  FaCode,
  FaFileAlt,
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const languageTemplates = {
  python: `print("Hello from Python!")`,
  cpp: `#include<iostream>\nusing namespace std;\nint main() {\n  cout << "Hello from C++";\n  return 0;\n}`,
  c: `#include<stdio.h>\nint main() {\n  printf("Hello from C");\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java");\n  }\n}`,
  node: `console.log("Hello from Node.js");`,
  ruby: `puts "Hello from Ruby"`
};

const CodeEditor = ({ problemId }) => {
  const [language, setLanguage] = useState("python");
  const [sourceCode, setSourceCode] = useState(languageTemplates["python"]);
  const [visibleTestCases, setVisibleTestCases] = useState([]);
  const [allTestCases, setAllTestCases] = useState([]);
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(false);
  const [problemName, setProblemName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/problems/${problemId}`);
        const all = res.data.testCases || [];
        setAllTestCases(all);
        setVisibleTestCases(all.filter(tc => !tc.hidden));
        setProblemName(res.data.title);
      } catch (err) {
        console.error("Failed to fetch problem:", err);
      }
    };
    if (problemId) fetchProblem();
  }, [problemId]);

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setLanguage(selected);
    setSourceCode(languageTemplates[selected]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput("⏳ Running...");
    setVerdict("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/code/submit`, {
        language,
        sourceCode,
        testCases: allTestCases,
      });

      setOutput(res.data.results.map((r, i) =>
        `Test Case #${i + 1}:\nInput: ${r.input}\nExpected: ${r.expected}\nOutput: ${r.output}\nVerdict: ${r.verdict}\n`
      ).join("\n\n"));

      const allAccepted = res.data.results.every(r => r.verdict === "Accepted");
      setVerdict(allAccepted ? "Accepted" : "Wrong Answer");
    } catch (err) {
      const msg = err.response?.data?.error || "Server error";
      setOutput(`❌ ${msg}`);
      setVerdict("Runtime Error");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/code/submit`, {
        language,
        sourceCode,
        testCases: allTestCases,
        problemId,
        problemName,
      });

      const verdict = res.data.results.every(r => r.verdict === "Accepted") ? "Accepted" : "Wrong Answer";

      await axios.post(`${API_BASE_URL}/api/submissions`, {
        problemId,
        problemName,
        language,
        sourceCode,
        verdict,
        results: res.data.results
      });

      navigate(`/submissions/${problemId}`);
    } catch (err) {
      console.error("❌ Submission error:", err.message);
      alert("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  const [aiFeedback, setAIFeedback] = useState("");




  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-md mt-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
        <FaCode /> {problemName || "Online Judge"}
      </h2>

      {/* Language Selector */}
      <div className="flex items-center gap-2 mb-4">
        <FaFileAlt className="text-gray-300" />
        <select
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-700 text-gray-200"
          value={language}
          onChange={handleLanguageChange}
        >
          {Object.keys(languageTemplates).map((lang) => (
            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Code Editor */}
      <textarea
        rows="12"
        className="w-full border p-4 rounded-md font-mono text-sm bg-gray-800 text-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
      />

      {/* Buttons */}
      <div className="flex gap-4 mt-4 flex-wrap">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 transition ${loading && "opacity-50 cursor-not-allowed"}`}
        >
          <FaPlay /> {loading ? "Running..." : "Run Code"}
        </button>
        <button
          onClick={handleFinalSubmit}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 transition ${loading && "opacity-50 cursor-not-allowed"}`}
        >
          📤 Submit
        </button>
       

      </div>
      
      {/* Verdict */}
      {verdict && (
        <div className="mt-6 p-4 rounded-md shadow-sm bg-gray-800">
          <h4 className="font-bold flex items-center gap-2 text-gray-200">
            <FaClipboardCheck /> Verdict:
          </h4>
          <p className={`mt-1 font-semibold flex items-center gap-2 ${
            verdict === "Accepted" ? "text-green-400" :
            verdict === "Wrong Answer" ? "text-red-400" :
            "text-yellow-400"
          }`}>
            {verdict === "Accepted" && <FaCheckCircle />}
            {verdict === "Wrong Answer" && <FaTimesCircle />}
            {verdict}
          </p>
        </div>
      )}

      {/* Output */}
      <div className="mt-6 p-4 bg-gray-900 border rounded-md shadow-inner">
        <h4 className="font-bold flex items-center gap-2 text-gray-200">
          <FaFileAlt /> Output:
        </h4>
        <pre className="whitespace-pre-wrap font-mono text-sm mt-2 text-gray-100">{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
