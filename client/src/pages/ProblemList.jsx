import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";

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
      console.error("Error fetching problems:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this problem?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/problems/${id}`);
        fetchProblems();
      } catch (err) {
        console.error("Error deleting problem:", err);
      }
    }
  };

  const handleSelect = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/problems/${id}`);
      if (onSelectProblem) onSelectProblem(res.data);
      navigate(`/problems/${id}`);
    } catch (err) {
      console.error("Error fetching selected problem:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
       

      < div className="flex-1 p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Title */}
          <h2 className="text-3xl font-bold text-yellow-400 flex items-center gap-2 mb-10">
            <FaCode /> All Problems
          </h2>

          {/* Grid Layout */}
          {problems.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">
              No problems found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {problems.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSelect(p._id)}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-yellow-400/20 transition"
                >
                  {/* Title & Difficulty */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-yellow-400 truncate">
                      {p.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        p.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : p.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="mt-3 text-sm text-gray-400 line-clamp-3">
                    {p.description || "No description available."}
                  </p>

                  {/* Footer: Edit + Delete */}
                  <div className="mt-5 flex justify-between text-sm text-gray-400">
                    <Link
                      to={`/edit/${p._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 hover:text-blue-400"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p._id);
                      }}
                      className="flex items-center gap-1 hover:text-red-500"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
    
      </div>
    </div>
  );
};

export default ProblemList;
