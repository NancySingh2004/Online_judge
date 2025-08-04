import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";

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
    return <p className="p-6 text-center text-gray-500">⏳ Loading problem...</p>;

  if (!problem)
    return (
      <p className="p-6 text-center text-red-600 font-semibold">
        ⚠️ Problem not found.
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
      <p className="text-sm text-gray-600 mb-2">Difficulty: {problem.difficulty}</p>
      <p className="mb-4">{problem.description}</p>

      <div className="bg-gray-50 p-4 rounded mb-6 space-y-3 text-sm text-gray-800">
        <div>
          <strong>Input Format:</strong>
          <div>{problem.inputFormat || "N/A"}</div>
        </div>
        <div>
          <strong>Output Format:</strong>
          <div>{problem.outputFormat || "N/A"}</div>
        </div>
        <div>
          <strong>Constraints:</strong>
          <div>{problem.constraints || "N/A"}</div>
        </div>
        <div>
          <strong>Sample Input:</strong>
          <pre className="bg-white border rounded p-2 whitespace-pre-wrap">
            {problem.sampleInput || "N/A"}
          </pre>
        </div>
        <div>
          <strong>Sample Output:</strong>
          <pre className="bg-white border rounded p-2 whitespace-pre-wrap">
            {problem.sampleOutput || "N/A"}
          </pre>
        </div>
      </div>

      {/* ✅ testCases removed here */}
      <CodeEditor
        problemId={problem._id}
        problemName={problem.title}
      />
    </div>
  );
};

export default ProblemPage;
