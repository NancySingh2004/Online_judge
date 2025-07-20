import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!problem) return <div className="p-4 text-red-500">Problem not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-500 hover:underline">← Back to Problems</Link>

      <h1 className="text-2xl font-bold mt-4 mb-2">{problem.title}</h1>
      <p className="text-sm text-gray-500 mb-4">Difficulty: {problem.difficulty}</p>

      <div className="mb-4">
        <h2 className="font-semibold text-lg">Description:</h2>
        <p>{problem.description}</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold text-lg">Input Format:</h2>
        <p>{problem.inputFormat}</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold text-lg">Output Format:</h2>
        <p>{problem.outputFormat}</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold text-lg">Constraints:</h2>
        <p>{problem.constraints}</p>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold text-lg">Sample Input:</h2>
        <pre className="bg-gray-100 p-2 rounded">{problem.sampleInput}</pre>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold text-lg">Sample Output:</h2>
        <pre className="bg-gray-100 p-2 rounded">{problem.sampleOutput}</pre>
      </div>

      {/* Optional: Show Edit button */}
      {user?.role === 'admin' && (
      <Link to={`/edit/${problem._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded">
        ✏️ Edit Problem
      </Link>
      )}
      <Link to={`/solve/${problem._id}`}>
  <button className="btn btn-primary mt-4">📝 Solve Now</button>
</Link>
     
    </div>
  );
};

export default ProblemDetails;
