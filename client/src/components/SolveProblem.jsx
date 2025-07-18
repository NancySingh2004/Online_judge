// SolveProblem.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SolveProblem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    axios.get(`/api/problems/${id}`).then((res) => setProblem(res.data));
  }, [id]);

  return (
    <div className="p-4">
      {problem ? (
        <>
          <h2 className="text-xl font-bold">{problem.title}</h2>
          <p className="text-gray-700 mb-4">{problem.description}</p>
          <textarea className="w-full h-64 p-2 border" placeholder="Write your code here..."></textarea>
          <button className="btn btn-success mt-2">🚀 Submit Code</button>
        </>
      ) : (
        <p>Loading problem...</p>
      )}
    </div>
  );
}
export default SolveProblem;
