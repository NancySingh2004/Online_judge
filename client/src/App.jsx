// ✅ CORRECT: App.jsx

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemList from './pages/ProblemList';
import AddProblem from './pages/AddProblem';
import EditProblem from './components/EditProblem';
//import ProblemDetails from './components/ProblemDetails';
//import SolveProblem from './components/SolveProblem';
import CodeEditor from './pages/CodeEditor';
import Dashboard from "./pages/Dashboard";
import HomePage from './pages/HomePage';
import ProblemPage from './pages/ProblemPage';
import SubmissionsPage from './pages/SubmissionPage';
import ProfilePage from './pages/ProfilePage';






export default function App() {
    const [selectedProblem, setSelectedProblem] = useState(null); 
  return (
    <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="/problems" element={<ProblemList onSelectProblem={setSelectedProblem} />} />
        <Route path="/add" element={<AddProblem />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit/:id" element={<EditProblem />} />
      
     
   {/*<Route path="/problems/:id" element={<ProblemDetails />} />*/}
      <Route path="/solve/:id" element={<CodeEditor problem={selectedProblem} />} />
      <Route path="/code" element={<CodeEditor/>}/>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/submissions/:problemId" element={<SubmissionsPage />} />
      <Route path="/problems/:id" element={<ProblemPage />} />
      <Route path="/profile" element={<ProfilePage />} />

    </Routes>
  );
}