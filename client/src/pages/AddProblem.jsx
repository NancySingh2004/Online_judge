import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/problems', form);
      navigate('/');
    } catch (err) {
      console.error('Error creating problem:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add New Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="input" />
        <select name="difficulty" value={form.difficulty} onChange={handleChange} className="input">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <input name="inputFormat" placeholder="Input Format" value={form.inputFormat} onChange={handleChange} className="input" />
        <input name="outputFormat" placeholder="Output Format" value={form.outputFormat} onChange={handleChange} className="input" />
        <input name="sampleInput" placeholder="Sample Input" value={form.sampleInput} onChange={handleChange} className="input" />
        <input name="sampleOutput" placeholder="Sample Output" value={form.sampleOutput} onChange={handleChange} className="input" />
        <input name="constraints" placeholder="Constraints" value={form.constraints} onChange={handleChange} className="input" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default AddProblem;
