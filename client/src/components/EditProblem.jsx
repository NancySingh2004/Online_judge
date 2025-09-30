import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '', hidden: false }]);

  useEffect(() => {
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/problems/${id}`);
      setForm({
        title: res.data.title,
        description: res.data.description,
        difficulty: res.data.difficulty,
        inputFormat: res.data.inputFormat || '',
        outputFormat: res.data.outputFormat || '',
        sampleInput: res.data.sampleInput || '',
        sampleOutput: res.data.sampleOutput || '',
        constraints: res.data.constraints || ''
      });
      setTestCases(res.data.testCases.length ? res.data.testCases : [{ input: '', expectedOutput: '', hidden: false }]);
    } catch (err) {
      console.error('Error fetching problem:', err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleTestCaseChange = (idx, field, value) => {
    const updated = [...testCases];
    if (field === 'hidden') updated[idx][field] = value.target.checked;
    else updated[idx][field] = value;
    setTestCases(updated);
  };
  const addTestCase = () => setTestCases([...testCases, { input: '', expectedOutput: '', hidden: false }]);
  const removeTestCase = (idx) => setTestCases(testCases.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/problems/${id}`, { ...form, testCases });
      navigate(`/problems/${id}`);
    } catch (err) {
      console.error('Error updating problem:', err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-200">
     

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Edit Problem</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Problem Fields */}
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
                    className="w-full border border-gray-700 bg-gray-800 px-4 py-2 rounded-xl h-28 resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md text-gray-200"
                  />
                ) : (
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-700 bg-gray-800 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md text-gray-200"
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
                className="w-full border border-gray-700 bg-gray-800 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md text-gray-200"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Test Cases */}
            <div>
              <label className="block text-gray-300 font-semibold mb-3">Test Cases</label>
              {testCases.map((tc, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-700 p-5 mb-4 rounded-2xl bg-gray-800 relative shadow-md"
                >
                  <div className="mb-3">
                    <label className="block text-gray-400 mb-1">Input</label>
                    <textarea
                      className="w-full border border-gray-600 px-3 py-2 rounded font-mono text-sm resize-y bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={tc.input}
                      onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-400 mb-1">Expected Output</label>
                    <textarea
                      className="w-full border border-gray-600 px-3 py-2 rounded font-mono text-sm resize-y bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      value={tc.expectedOutput}
                      onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={tc.hidden}
                      onChange={(e) => handleTestCaseChange(idx, 'hidden', e)}
                      className="accent-yellow-400"
                    />
                    <label className="text-gray-400 text-sm">Mark as Hidden</label>
                  </div>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(idx)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </motion.div>
              ))}

              <button
                type="button"
                onClick={addTestCase}
                className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition shadow-md"
              >
                + Add Test Case
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 px-6 rounded-xl font-semibold transition shadow-md"
            >
              Update Problem
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProblem;
