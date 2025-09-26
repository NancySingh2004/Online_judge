// ProblemPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import CodeReview from "../components/CodeReviewChatbot";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/problems/${id}`);
        setProblem(res.data);
      } catch (error) {
        console.error("❌ Error fetching problem:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-400">⏳ Loading problem...</p>
    );

  if (!problem)
    return (
      <p className="p-6 text-center text-red-500 font-semibold">
        ⚠️ Problem not found.
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-gray-100">
      {/* Problem Header */}
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        {problem.title}
      </h1>
      <p className="text-sm mb-2">
        Difficulty:{" "}
        <span className="font-semibold bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
          {problem.difficulty}
        </span>
      </p>
      <p className="mb-4 text-gray-300">{problem.description}</p>

      {/* Problem Details */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow-md space-y-3 text-sm">
        <div>
          <strong className="bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Input Format:
          </strong>
          <div className="text-gray-300">{problem.inputFormat || "N/A"}</div>
        </div>
        <div>
          <strong className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Output Format:
          </strong>
          <div className="text-gray-300">{problem.outputFormat || "N/A"}</div>
        </div>
        <div>
          <strong className="bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
            Constraints:
          </strong>
          <div className="text-gray-300">{problem.constraints || "N/A"}</div>
        </div>
        <div>
          <strong className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sample Input:
          </strong>
          <pre className="bg-gray-700 border border-gray-600 rounded p-2 text-gray-100 whitespace-pre-wrap">
            {problem.sampleInput || "N/A"}
          </pre>
        </div>
        <div>
          <strong className="bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Sample Output:
          </strong>
          <pre className="bg-gray-700 border border-gray-600 rounded p-2 text-gray-100 whitespace-pre-wrap">
            {problem.sampleOutput || "N/A"}
          </pre>
        </div>
      </div>

      {/* Code Editor */}
      <CodeEditor problemId={problem._id} problemName={problem.title} />

      {/* Code Review / Chatbot */}
      <div className="mt-6">
        <CodeReview />
      </div>
    </div>
  );
};

export default ProblemPage;
