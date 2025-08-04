import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';

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
    if (field === 'hidden') {
      updated[index][field] = value.target.checked;
    } else {
      updated[index][field] = value;
    }
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', hidden: false }]);
  };

  const removeTestCase = (index) => {
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/problems`, {
        ...form,
        testCases,
      });
      navigate(`/problems/${res.data._id}`);
    } catch (err) {
      console.error('Error creating problem:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6 flex items-center gap-2 text-indigo-700">
          <FaPlusCircle className="text-2xl" />
          <h2 className="text-2xl font-bold">Add New Problem</h2>
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
              <label className="block text-gray-700 font-medium mb-1">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md h-32 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required={name === 'title' || name === 'description'}
                />
              ) : (
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required={name === 'title' || name === 'description'}
                />
              )}
            </div>
          ))}

          {/* Difficulty */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Test Cases */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Test Cases</label>
            {testCases.map((tc, idx) => (
              <div key={idx} className="border p-4 mb-4 rounded bg-gray-50 relative">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded font-mono text-sm resize-y"
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Output</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded font-mono text-sm resize-y"
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
                  />
                  <label className="text-sm text-gray-600">Mark as Hidden</label>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-md font-semibold transition duration-200"
          >
            Submit Problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
