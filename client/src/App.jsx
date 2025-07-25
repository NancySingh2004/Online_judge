// ✅ CORRECT: App.jsx

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import AddProblem from './pages/AddProblem';
import EditProblem from './components/EditProblem';
import ProblemDetails from './components/ProblemDetails';
//import SolveProblem from './components/SolveProblem';
import CodeEditor from './pages/CodeEditor';



export default function App() {
    const [selectedProblem, setSelectedProblem] = useState(null); 
  return (
    <Routes>
       <Route path="/" element={<ProblemList onSelectProblem={setSelectedProblem} />} />
        <Route path="/add" element={<AddProblem />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit/:id" element={<EditProblem />} />
      <Route path="/problems/:id" element={<ProblemDetails />} />
      <Route path="/solve/:id" element={<CodeEditor problem={selectedProblem} />} />
      <Route path="/code" element={<CodeEditor/>}/>

    </Routes>
  );
}
