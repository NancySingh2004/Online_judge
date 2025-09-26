import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaTrophy,
  FaChartLine,
  FaSignInAlt,
  FaUserPlus,
  FaLaptopCode,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight flex items-center gap-2 hover:text-indigo-400 transition"
          >
            <FaLaptopCode className="text-indigo-400" />
            Online Judge
          </Link>

          {/* Desktop Menu */}
          <div className="space-x-8 hidden md:flex font-medium">
            <Link
              to="/problems"
              className="hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <FaCode /> Problems
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <FaChartLine /> Dashboard
            </Link>
            <Link
              to="/login"
              className="hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <FaSignInAlt /> Login
            </Link>
            <Link
              to="/register"
              className="hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <FaUserPlus /> Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-800 px-6 py-4 space-y-4">
            <Link to="/problems" className="block hover:text-indigo-400">
              Problems
            </Link>
            <Link to="/dashboard" className="block hover:text-indigo-400">
              Dashboard
            </Link>
            <Link to="/login" className="block hover:text-indigo-400">
              Login
            </Link>
            <Link to="/register" className="block hover:text-indigo-400">
              Register
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center py-24 flex flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          Welcome to <span className="text-yellow-300">Online Judge</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-lg md:text-2xl max-w-2xl mx-auto mb-10"
        >
          Compete. Code. Conquer. Sharpen your skills with real-world challenges.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link
            to="/problems"
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition"
          >
            <FaCode className="inline mr-2" />
            Start Solving
          </Link>
        </motion.div>
      </header>

      {/* Feature Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-3">
          {[
            {
              icon: <FaCode />,
              title: "Practice Problems",
              desc: "Solve hand-picked questions from basic to advanced levels and boost your coding skills.",
            },
            {
              icon: <FaTrophy />,
              title: "Live Contests",
              desc: "Test yourself in real-time contests and battle with top coders from across the globe.",
            },
            {
              icon: <FaChartLine />,
              title: "Leaderboard",
              desc: "Track your performance and rise to the top with each problem you solve.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition"
            >
              <div className="text-4xl text-indigo-600 mb-4">{card.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-auto">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">Online Judge</span>. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
}
