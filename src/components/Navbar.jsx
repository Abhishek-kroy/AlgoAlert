import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaRegMoon, FaSun, FaBars, FaTimes, FaSignOutAlt, FaUser, FaBell } from "react-icons/fa";
import { FaCode, FaChartLine } from "react-icons/fa6";
import { FaCalendarAlt, FaHome } from "react-icons/fa";

const Navbar = ({ isDarkMode, toggleDarkMode, isMenuOpen, setIsMenuOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [hasNotifications, setHasNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check scroll position for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is logged in on component mount or route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Get first letter of email or username for avatar
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const userData = JSON.parse(userInfo);
          const displayName = userData.name || userData.email;
          setUserName(displayName.charAt(0).toUpperCase());
        } catch (e) {
          setUserName("U");
        }
      } else {
        setUserName("U");
      }
    } else {
      setIsLoggedIn(false);
    }
    
    // Close mobile menu when navigating
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile-tracker");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "backdrop-blur-md bg-opacity-90 shadow-lg" : "backdrop-blur-sm bg-opacity-80"} ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            aria-label="Home"
          >
            <FaCode className="text-orange-500 text-2xl group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-orange-500">Algo</span>
              <span className="group-hover:text-orange-400 transition-colors">Alert</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${location.pathname === "/" ? "text-orange-500 font-medium" : "hover:text-orange-400"}`}
            >
              <FaHome className="text-sm" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/QuestionTrackerPage" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${location.pathname === "/QuestionTrackerPage" ? "text-orange-500 font-medium" : "hover:text-orange-400"}`}
            >
              <FaChartLine className="text-sm" />
              <span>Question Tracker</span>
            </Link>
            
            <Link 
              to="/EventTrackerPage" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${location.pathname === "/EventTrackerPage" ? "text-orange-500 font-medium" : "hover:text-orange-400"}`}
            >
              <FaCalendarAlt className="text-sm" />
              <span>Event Tracker</span>
            </Link>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition-colors"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <FaSun className="text-yellow-300" /> : <FaRegMoon />}
            </button>
            
            {isLoggedIn && (
              <button 
                className="p-2 relative rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition-colors"
                aria-label="Notifications"
              >
                <FaBell />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 ml-2">
                <div 
                  onClick={handleProfileClick}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                  aria-label="User profile"
                  title="Profile"
                >
                  {userName}
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-200 hover:dark:bg-gray-700 transition-colors"
                  aria-label="Logout"
                >
                  <FaSignOutAlt />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link 
                  to="/login" 
                  className="px-4 py-1.5 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:opacity-90 transition-opacity shadow-md"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-1.5 text-sm border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 hover:dark:bg-gray-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 hover:dark:bg-gray-700 transition-colors"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <FaSun className="text-yellow-300" /> : <FaRegMoon />}
            </button>
            
            <button 
              className="p-2 rounded-md hover:bg-gray-200 hover:dark:bg-gray-700 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className={`md:hidden transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${location.pathname === "/" ? "bg-orange-100 dark:bg-gray-800 text-orange-500" : "hover:bg-gray-100 hover:dark:bg-gray-800"}`}
            >
              <FaHome />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/QuestionTrackerPage" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${location.pathname === "/QuestionTrackerPage" ? "bg-orange-100 dark:bg-gray-800 text-orange-500" : "hover:bg-gray-100 hover:dark:bg-gray-800"}`}
            >
              <FaChartLine />
              <span>Question Tracker</span>
            </Link>
            
            <Link 
              to="/EventTrackerPage" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${location.pathname === "/EventTrackerPage" ? "bg-orange-100 dark:bg-gray-800 text-orange-500" : "hover:bg-gray-100 hover:dark:bg-gray-800"}`}
            >
              <FaCalendarAlt />
              <span>Event Tracker</span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <div 
                  onClick={handleProfileClick}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${location.pathname === "/profile-tracker" ? "bg-orange-100 dark:bg-gray-800 text-orange-500" : "hover:bg-gray-100 hover:dark:bg-gray-800"}`}
                >
                  <FaUser />
                  <span>Profile</span>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md hover:bg-gray-100 hover:dark:bg-gray-800 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-2 pt-2">
                <Link 
                  to="/login" 
                  className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex-1 text-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 hover:dark:bg-gray-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;