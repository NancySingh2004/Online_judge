import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddProblem = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    inputFormat: '',
    outputFormat: '',
    sampleInput: '',
    sampleOutput: '',
    constraints: ''
  });

  const [testCases, setTestCases] = useState([
    { input: '', expectedOutput: '', hidden: false }
  ]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    if (field === 'hidden') updated[index][field] = value.target.checked;
    else updated[index][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => setTestCases([...testCases, { input: '', expectedOutput: '', hidden: false }]);
  const removeTestCase = (index) => {
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/problems`, { ...form, testCases });
      navigate(`/problems/${res.data._id}`);
    } catch (err) {
      console.error('Error creating problem:', err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 shadow-md flex flex-col justify-between z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-yellow-400 mb-6">OJ Dashboard</h1>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-2 mb-6 text-yellow-400">
            <FaPlusCircle className="text-3xl" />
            <h2 className="text-3xl font-bold">Add New Problem</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Static Fields */}
            {[
              { label: 'Title', name: 'title', type: 'input' },
              { label: 'Description', name: 'description', type: 'textarea' },
              { label: 'Input Format', name: 'inputFormat' },
              { label: 'Output Format', name: 'outputFormat' },
              { label: 'Sample Input', name: 'sampleInput' },
              { label: 'Sample Output', name: 'sampleOutput' },
              { label: 'Constraints', name: 'constraints' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-gray-300 font-medium mb-1">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-700 px-4 py-2 rounded-md h-32 resize-y bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required={name === 'title' || name === 'description'}
                  />
                ) : (
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-700 px-4 py-2 rounded-md bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required={name === 'title' || name === 'description'}
                  />
                )}
              </div>
            ))}

            {/* Difficulty */}
            <div>
              <label className="block text-gray-300 font-medium mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full border border-gray-700 px-4 py-2 rounded-md bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Test Cases */}
            <div>
              <label className="block text-gray-300 font-semibold mb-2">Test Cases</label>
              {testCases.map((tc, idx) => (
                <div key={idx} className="border border-gray-700 p-4 mb-4 rounded bg-gray-900 relative">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Input</label>
                    <textarea
                      className="w-full border border-gray-700 px-3 py-2 rounded font-mono text-sm resize-y bg-gray-800 text-gray-200"
                      value={tc.input}
                      onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expected Output</label>
                    <textarea
                      className="w-full border border-gray-700 px-3 py-2 rounded font-mono text-sm resize-y bg-gray-800 text-gray-200"
                      value={tc.expectedOutput}
                      onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={tc.hidden}
                      onChange={(e) => handleTestCaseChange(idx, 'hidden', e)}
                      className="accent-yellow-400"
                    />
                    <label className="text-sm text-gray-400">Mark as Hidden</label>
                  </div>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(idx)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTestCase}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                + Add Test Case
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-6 rounded-md font-semibold transition duration-200"
            >
              Submit Problem
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProblem;
