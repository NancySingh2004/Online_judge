import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCode,
  FaTrophy,
  FaChartLine,
  FaSignInAlt,
  FaUserPlus,
  FaLaptopCode
} from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FaLaptopCode className="text-indigo-400" />
            Online Judge
          </Link>
          <div className="space-x-6 hidden md:flex">
            <Link to="/problems" className="hover:text-indigo-400 flex items-center gap-1"><FaCode /> Problems</Link>
            <Link to="/contests" className="hover:text-indigo-400 flex items-center gap-1"><FaTrophy /> Contests</Link>
            <Link to="/leaderboard" className="hover:text-indigo-400 flex items-center gap-1"><FaChartLine /> Leaderboard</Link>
            <Link to="/login" className="hover:text-indigo-400 flex items-center gap-1"><FaSignInAlt /> Login</Link>
            <Link to="/register" className="hover:text-indigo-400 flex items-center gap-1"><FaUserPlus /> Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Welcome to Online Judge</h1>
        <p className="text-xl mb-8">Compete. Code. Conquer. Sharpen your skills with real-world challenges.</p>
        <Link to="/problems" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
          <FaCode className="inline mr-2" />
          Start Solving
        </Link>
      </header>

      {/* Feature Cards */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-indigo-600">
              <FaCode /> Practice Problems
            </h3>
            <p className="text-gray-600">Solve hand-picked questions from basic to advanced levels and boost your coding skills.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-indigo-600">
              <FaTrophy /> Live Contests
            </h3>
            <p className="text-gray-600">Test yourself in real-time contests and battle with top coders from across the globe.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-indigo-600">
              <FaChartLine /> Leaderboard
            </h3>
            <p className="text-gray-600">Track your performance and rise to the top with each problem you solve.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-10">
        <p>© {new Date().getFullYear()} Online Judge. All rights reserved.</p>
      </footer>
    </div>
  );
}
