import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaCode, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProblemList = ({ onSelectProblem }) => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
   if (!token) {
     navigate("/login");
     return;
   }
  fetchProblems(token);
  }, []);
   useEffect(() => {
    filterProblems();
  }, [search, difficultyFilter, problems]);

  const fetchProblems = async (token) => {
    try {
       const res = await axios.get(`${API_BASE_URL}/api/problems`, {
      headers: { Authorization: `Bearer ${token}` },
    });
      setProblems(res.data);
    } catch (err) {
      console.error("Error fetching problems:", err);
      navigate("/login");
    }
  };
const filterProblems = () => {
    let filtered = [...problems];

    // Filter by difficulty
    if (difficultyFilter !== "All") {
      filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    }

    // Filter by search
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    setFilteredProblems(filtered);
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
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Search */}
            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 placeholder-gray-500 text-gray-200 focus:outline-none focus:border-yellow-400"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-3">
              {["All", "Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition
                    ${
                      difficultyFilter === level
                        ? "bg-yellow-400 text-gray-900 shadow-lg"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
           {/* Grid Layout */}
          {filteredProblems.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">
              No problems found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProblems.map((p) => (
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
