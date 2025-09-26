import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

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
      await axios.put(`${API_BASE_URL}/api/problems/${id}`, { ...form, testCases });
      navigate(`/problems/${id}`);
    } catch (err) {
      console.error('Error updating problem:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Edit Problem</h2>

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
                  className="w-full border px-4 py-2 rounded-lg h-28 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                />
              ) : (
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
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
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          {/* Test Cases */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">Test Cases</label>
            {testCases.map((tc, idx) => (
              <div key={idx} className="border p-5 mb-4 rounded-xl bg-gray-50 relative shadow-sm">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Output</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                  />
                  <label className="text-sm text-gray-600">Mark as Hidden</label>
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
              </div>
            ))}

            <button
              type="button"
              onClick={addTestCase}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
            >
              + Add Test Case
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            Update Problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProblem;
