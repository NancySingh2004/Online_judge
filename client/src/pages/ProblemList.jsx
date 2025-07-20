import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ProblemList = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/problems`);
      setProblems(res.data);
    } catch (err) {
      console.error('Error fetching problems:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this problem?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/problems/${id}`);
        fetchProblems(); // Refresh list
      } catch (err) {
        console.error('Error deleting problem:', err);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Problems</h2>
      <Link to="/add" className="bg-green-500 text-white px-3 py-1 rounded">Add New Problem</Link>
      <ul className="mt-4 space-y-3">
        {problems.map((p) => (
          <li key={p._id} className="border p-3 rounded shadow">
            <Link to={`/problems/${p._id}`} className="font-semibold text-blue-600">{p.title}</Link>
            <p className="text-sm text-gray-600">Difficulty: {p.difficulty}</p>
            <div className="mt-2 flex gap-4">
              <Link to={`/edit/${p._id}`} className="text-blue-500">Edit</Link>
              <button onClick={() => handleDelete(p._id)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemList;
