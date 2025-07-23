import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProblemList = ({ onSelectProblem }) => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

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
        fetchProblems();
      } catch (err) {
        console.error('Error deleting problem:', err);
      }
    }
  };

  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/problems/${id}`);
      if (onSelectProblem) {
        onSelectProblem(res.data); // Send selected problem to parent
      }
      navigate(`/problems/${id}`); // Optional: navigate to detail page
    } catch (err) {
      console.error('Error fetching selected problem:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Problems</h2>
      <Link to="/add" className="bg-green-500 text-white px-3 py-1 rounded">Add New Problem</Link>
      <ul className="mt-4 space-y-3">
        {problems.map((p) => (
          <li
            key={p._id}
            className="border p-3 rounded shadow hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelect(p._id)}
          >
            <div className="font-semibold text-blue-600">{p.title}</div>
            <p className="text-sm text-gray-600">Difficulty: {p.difficulty}</p>
            <div className="mt-2 flex gap-4">
              <Link to={`/edit/${p._id}`} className="text-blue-500" onClick={(e) => e.stopPropagation()}>Edit</Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(p._id);
                }}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemList;
