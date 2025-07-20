import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

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

  useEffect(() => {
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/problems/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error('Error fetching problem:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/problems/${id}`, form);
      navigate('/');
    } catch (err) {
      console.error('Error updating problem:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center"> Edit Problem</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Title', name: 'title', type: 'text' },
            { label: 'Description', name: 'description', type: 'textarea' },
            { label: 'Input Format', name: 'inputFormat', type: 'text' },
            { label: 'Output Format', name: 'outputFormat', type: 'text' },
            { label: 'Sample Input', name: 'sampleInput', type: 'text' },
            { label: 'Sample Output', name: 'sampleOutput', type: 'text' },
            { label: 'Constraints', name: 'constraints', type: 'text' }
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
             Update Problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProblem;
