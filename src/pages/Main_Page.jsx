import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import EventTrackerPage from "./EventTrackerPage";
import QuestionTrackerPage from "./QuestionTrackerPage";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "../components/Navbar";
import Calendar from "../components/Calendar";
import ContestPopup from "../components/ContestPopup";

const Main_Page = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  
  const location = useLocation(); // Get current route path

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling when menu is open
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when menu is closed
    }
  }, [isMenuOpen]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <div className={isDarkMode ? "bg-black text-white" : "bg-white text-black"}>
        <Navbar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

      {/* Hide content when menu is open (mobile view only) */}
      <div className={`transition-all duration-300 ${isMenuOpen ? "hidden md:block" : "block"}`}>
        <Routes>
          {/* ✅ Default Route ("/") - Shows Event Tracker Page */}
          <Route 
            path="/" 
            element={<EventTrackerPage isDarkMode={isDarkMode} isMenuOpen={isMenuOpen} onContestClick={setSelectedContest} />} 
          />
          <Route 
            path="/QuestionTrackerPage" 
            element={<QuestionTrackerPage isDarkMode={isDarkMode} />} 
          />
          <Route 
            path="/EventTrackerPage" 
            element={
              <EventTrackerPage 
                isDarkMode={isDarkMode} 
                isMenuOpen={isMenuOpen} 
                onContestClick={setSelectedContest} 
              />
            } 
          />
          <Route 
            path="/login" 
            element={
              <Login 
                isDarkMode={isDarkMode} 
                isMenuOpen={isMenuOpen} 
              />
            } 
          />
          <Route 
            path="/signup" 
            element={
              <Signup
                isDarkMode={isDarkMode} 
                isMenuOpen={isMenuOpen} 
              />
            } 
          />
          {/* ✅ Catch-all route for 404 */}
          <Route path="*" element={<h1 className="text-center mt-10">404 - Page Not Found</h1>} />
        </Routes>

        {/* ✅ Show calendar only on Event Tracker Page */}
        {location.pathname === "/EventTrackerPage" && (
          <Calendar isDarkMode={isDarkMode} isMenuOpen={isMenuOpen} onContestClick={setSelectedContest} />
        )}

        {selectedContest && (
          <ContestPopup contest={selectedContest} onClose={() => setSelectedContest(null)} />
        )}
      </div>
    </div>
  );
};

export default Main_Page;
