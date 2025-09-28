import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaCode, FaTrophy, FaChartLine, FaSignInAlt, FaUserPlus, FaLaptopCode, 
  FaBars, FaTimes, FaStar, FaShieldAlt, FaRocket 
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./HomePage.css";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col text-gray-200">

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2 
                                 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 
                                 bg-clip-text text-transparent hover:text-yellow-300 transition">
            <FaLaptopCode className="text-yellow-400" />
            CodeNest
          </Link>
          <div className="space-x-8 hidden md:flex font-medium">
            {[
              { path: "/problems", name: "Problems", icon: <FaCode /> },
              { path: "/dashboard", name: "Dashboard", icon: <FaChartLine /> },
              { path: "/login", name: "Login", icon: <FaSignInAlt /> },
              { path: "/register", name: "Register", icon: <FaUserPlus /> }
            ].map((tab, i) => (
              <Link
                key={i}
                to={tab.path}
                className="flex items-center gap-1 px-2 py-1 border-b-2 border-transparent hover:border-yellow-400 transition-colors duration-300"
              >
                {tab.icon} {tab.name}
              </Link>
            ))}
          </div>
          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-gray-800 px-6 py-4 space-y-4 rounded-b-lg">
            {[
              { path: "/problems", name: "Problems" },
              { path: "/dashboard", name: "Dashboard" },
              { path: "/login", name: "Login" },
              { path: "/register", name: "Register" }
            ].map((tab, i) => (
              <Link
                key={i}
                to={tab.path}
                className="block px-2 py-1 border-b-2 border-transparent hover:border-yellow-400 transition-colors duration-300"
              >
                {tab.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-purple-800 via-indigo-900 to-blue-900 text-white text-center py-36 flex flex-col justify-center overflow-hidden">

        {/* Grid Layer (Backmost) */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 grid-animate z-0">
          {Array.from({ length: 12*12 }).map((_, i) => (
            <div key={i} className="border border-gray-600 opacity-20"></div>
          ))}
        </div>

        {/* Hero Text Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-10"></div>

        {/* Hero Text */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-20 text-6xl md:text-7xl font-extrabold mb-6 leading-tight 
                     bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 
                     bg-clip-text text-transparent hover-animate-gradient"
        >
          Welcome to <span className="text-yellow-400">CodeNest</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative z-20 text-xl md:text-3xl max-w-3xl mx-auto mb-12 text-gray-300"
        >
          Compete. Code. Conquer. Sharpen your skills with real-world challenges.
        </motion.p>

        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} className="relative z-20">
          <Link to="/problems" className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition hover-animate-gradient">
            <FaCode className="inline mr-2" /> Start Solving
          </Link>
        </motion.div>
      </header>

      {/* Feature Cards */}
      <section className="py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative">
        {/* Grid Layer */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 grid-animate z-0">
          {Array.from({ length: 12*12 }).map((_, i) => (
            <div key={i} className="border border-gray-600 opacity-20"></div>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-3 z-10">
          {[
            { icon: <FaCode />, title: "Practice Problems", desc: "Solve hand-picked questions from basic to advanced levels and boost your coding skills." },
            { icon: <FaTrophy />, title: "Live Contests", desc: "Test yourself in real-time contests and battle with top coders from across the globe." },
            { icon: <FaChartLine />, title: "Leaderboard", desc: "Track your performance and rise to the top with each problem you solve." },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl shadow-2xl p-10 text-center cursor-pointer 
                         hover:shadow-3xl transition relative border-2 border-transparent hover:border-yellow-400"
            >
              <div className="text-6xl mb-6 hover-animate-gradient">{card.icon}</div>
              <h3 className="text-3xl font-bold mb-4 
                             bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 
                             bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                {card.title}
              </h3>
              <p className="text-gray-300 text-lg">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-gray-800 text-gray-200 text-center">
        <h2 className="text-4xl font-bold mb-12 
                       bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 
                       bg-clip-text text-transparent hover-animate-gradient">
          Why Choose CodeNest?
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          {[
            { icon: <FaStar />, title: "Quality Problems", desc: "Curated problems from easy to hard levels to sharpen your skills." },
            { icon: <FaShieldAlt />, title: "Secure Platform", desc: "Your data and progress are completely safe and private." },
            { icon: <FaRocket />, title: "Fast & Reliable", desc: "Lightning-fast code execution and submission handling." }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl shadow-2xl p-10 relative 
                         border-2 border-transparent hover:border-yellow-400"
            >
              <div className="text-5xl text-yellow-400 mb-6 hover-animate-gradient">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-3 
                             bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 
                             bg-clip-text text-transparent hover:animate-gradient">
                {item.title}
              </h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-12 mt-auto">
        <p>
          © {new Date().getFullYear()} <span className="text-yellow-400 font-semibold hover-animate-gradient">CodeNest</span>. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
