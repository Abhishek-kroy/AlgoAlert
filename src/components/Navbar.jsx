import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegMoon, FaBars, FaTimes } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";

const Navbar = ({ isDarkMode, toggleDarkMode, isMenuOpen, setIsMenuOpen }) => {
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`px-6 py-4 flex items-center justify-between transition-all duration-300 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="flex items-center space-x-2">
        <FaCode />
        <span className="text-xl font-bold">
          <span className="text-orange-500">Algo</span>Alert
        </span>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <Link to="/QuestionTrackerPage" className="hover:text-orange-500 transition">Question Tracker</Link>
        <Link to="/EventTrackerPage" className="hover:text-orange-500 transition">Event Tracker</Link>
        <a href="#" className="hover:text-orange-500 transition">Profile Tracker</a>
        <FaRegMoon className="cursor-pointer text-lg" onClick={toggleDarkMode} />
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold">
          U
        </div>
      </div>

      <button className="md:hidden" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {isMenuOpen && (
        <div className={`absolute top-16 right-0 left-0 shadow-lg rounded-lg md:hidden transition-all duration-300 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
          <div className="flex flex-col items-center py-4 space-y-4">
            <Link to="/QuestionTrackerPage" className="hover:text-orange-500">Question Tracker</Link>
            <Link to="/EventTrackerPage" className="hover:text-orange-500">Event Tracker</Link>
            <a href="#" className="hover:text-orange-500">Profile Tracker</a>
            <FaRegMoon className="cursor-pointer text-lg" onClick={toggleDarkMode} />
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold">
              U
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
