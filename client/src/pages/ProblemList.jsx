import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCode } from 'react-icons/fa';

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
        onSelectProblem(res.data);
      }
      navigate(`/problems/${id}`);
    } catch (err) {
      console.error('Error fetching selected problem:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaCode className="text-indigo-600" /> All Problems
          </h2>
          <Link
            to="/add"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition"
          >
            <FaPlus /> Add Problem
          </Link>
        </div>

        <div className="space-y-4">
          {problems.length === 0 && (
            <div className="text-gray-500 text-center mt-10">No problems found.</div>
          )}

          {problems.map((p) => (
            <div
              key={p._id}
              onClick={() => handleSelect(p._id)}
              className="bg-white border hover:shadow-md rounded-lg p-5 cursor-pointer transition group"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-indigo-700 group-hover:underline">{p.title}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    p.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-700'
                      : p.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {p.difficulty}
                </span>
              </div>

              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <Link
                  to={`/edit/${p._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <FaEdit /> Edit
                </Link>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p._id);
                  }}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemList;
