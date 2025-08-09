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
        testCases: allTestCases, // ✅ Includes both visible & hidden
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
  const navigate = useNavigate();

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

    // Save to submission history
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <FaCode /> {problemName || "Online Judge Code Runner"}
      </h2>

      <label className="block mb-2 font-semibold">
        <FaFileAlt className="inline mr-1" /> Select Language:
      </label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={language}
        onChange={handleLanguageChange}
      >
        {Object.keys(languageTemplates).map((lang) => (
          <option key={lang} value={lang}>{lang.toUpperCase()}</option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">
        <FaCode className="inline mr-1" /> Code:
      </label>
      <textarea
        rows="10"
        className="w-full border p-2 rounded mb-4 font-mono text-sm bg-gray-50"
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
      />

      <h3 className="font-semibold text-lg mb-2">Visible Sample Test Cases:</h3>
      {visibleTestCases.length === 0 ? (
        <p className="text-sm text-gray-600 mb-4">No visible test cases to show.</p>
      ) : visibleTestCases.map((tc, index) => (
        <div key={index} className="mb-4 border rounded p-3 bg-gray-50">
          <label className="block mb-1 font-semibold">Test Case #{index + 1} Input:</label>
          <textarea
            rows="2"
            readOnly
            className="w-full border p-2 rounded font-mono text-sm mb-2 bg-gray-100 cursor-not-allowed"
            value={tc.input}
          />
          <label className="block mb-1 font-semibold">Expected Output:</label>
          <textarea
            rows="2"
            readOnly
            className="w-full border p-2 rounded font-mono text-sm bg-gray-100 cursor-not-allowed"
            value={tc.expectedOutput}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${loading && "opacity-50 cursor-not-allowed"}`}
      >
        <FaPlay /> {loading ? "Running..." : "Run Code"}
      </button>
      <button
  onClick={handleFinalSubmit}
  disabled={loading}
  className={`mt-3 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition ${loading && "opacity-50 cursor-not-allowed"}`}
>
  📤 Submit
</button>


      {verdict && (
        <div className="mt-6">
          <h4 className="font-bold flex items-center gap-2">
            <FaClipboardCheck /> Verdict:
          </h4>
          <p className={`font-semibold flex items-center gap-2 mt-1 ${
            verdict === "Accepted" ? "text-green-600" :
            verdict === "Wrong Answer" ? "text-red-500" :
            "text-yellow-500"
          }`}>
            {verdict === "Accepted" && <FaCheckCircle />}
            {verdict === "Wrong Answer" && <FaTimesCircle />}
            {verdict}
          </p>
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-bold flex items-center gap-2">
          <FaFileAlt /> Output:
        </h4>
        <pre className="bg-gray-100 border p-4 rounded whitespace-pre-wrap text-sm font-mono text-gray-700 mt-2">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
