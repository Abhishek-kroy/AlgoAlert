import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  BarChart2,
  Bell,
  Code,
  Zap,
  User,
  Mail,
  Lock,
  Calendar,
} from "lucide-react";

const Signup = ({ isDarkMode, setMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);

  const navigate = useNavigate();

  // Animation for benefits
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationIndex(prev => (prev + 1) % benefits.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toLoginPage = () => {
    navigate('/login');
  };

  const handleSignup = async (e) => {
    e && e.preventDefault();

    if (!name) {
      setError("Please enter your full name");
      return;
    }

    if (!email) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("https://algoalertbackend.onrender.com/api/v1/register", {
        name,
        email,
        password
      });

      if (response.data.success) {
        setSuccessMessage("Account created successfully!");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Benefits for the right panel
  const benefits = [
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Contest Notifications",
      description: "Get instant alerts about upcoming coding contests and challenges.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Event Tracking",
      description: "Never miss a hackathon or coding competition with our event calendar.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Question Tracking",
      description: "Monitor your progress through practice problems and competition questions.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Track your solving speed and efficiency with detailed metrics.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Competitor Rankings",
      description: "See how you stack up against other coders in our global leaderboard.",
      color: "text-orange-500 dark:text-orange-400"
    }
  ];

  // Determine theme-based classes
  const isDark = isDarkMode;

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl animate-fadeIn">
          <div className={`flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl 
            ${isDark ? 'bg-gray-800 shadow-orange-900/20' : 'bg-white shadow-gray-200/50'} 
            transition-all duration-300 transform hover:scale-[1.01]`}>

            {/* Right Side - Benefits and Info */}
            <div
              className={`animate-slide-left z-10 w-full lg:w-1/2 relative overflow-hidden transition-transform duration-700 ease-in-out transform ${isDark ? 'bg-gradient-to-br from-orange-900 to-orange-700' : 'bg-gradient-to-br from-orange-600 to-orange-500'}`}
            >
              {/* Background animated particles */}
              <div className="absolute inset-0 overflow-hidden opacity-20">
                {[...Array(20)].map((_, index) => (
                  <div
                    key={index}
                    className="absolute rounded-full bg-white"
                    style={{
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `float ${Math.random() * 10 + 10}s linear infinite`
                    }}
                  />
                ))}
              </div>

              <div className="max-w-md mx-auto relative z-10 p-8 lg:p-12">
                <h2 className="text-3xl font-bold mb-6 text-white">Dominate Coding Competitions with AlgoAlert</h2>
                <p className="text-orange-100 mb-8">
                  Join thousands of competitive programmers who are improving their skills and tracking their progress with our comprehensive contest platform.
                </p>

                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-4 p-3 rounded-lg transition-all duration-500 transform
                        ${animationIndex === index ? 'scale-105 bg-white/10' : 'scale-100 bg-transparent'}`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${benefit.color} ${animationIndex === index ? 'animate-pulse bg-white' : 'bg-white'}`}>
                        <div className="transform transition-transform duration-500 hover:rotate-12">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white">{benefit.title}</h3>
                        <p className="text-orange-100">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <p className="font-medium mb-2 text-white">Sign up takes less than 1 minute</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-300"></div>
                    <span className="text-orange-200 text-sm ml-1">Secure & free to join</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side - Signup Form */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
                  Join AlgoAlert
                </h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 transition-colors duration-300`}>
                  Start tracking coding contests and improving your skills today
                </p>

                {/* Error and Success Messages */}
                {error && (
                  <div className={`p-3 rounded-lg text-sm mb-4 ${isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'} animate-pulse transition-colors duration-300`}>
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className={`p-3 rounded-lg text-sm mb-4 ${isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-50 text-green-600'} animate-pulse transition-colors duration-300`}>
                    {successMessage}
                  </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="group">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-3 pl-10 rounded-lg focus:outline-none transition-all duration-300
                          ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-orange-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-orange-500'}`}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-3 pl-10 rounded-lg focus:outline-none transition-all duration-300
                          ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-orange-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-orange-500'}`}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                      Password
                    </label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full p-3 pl-10 rounded-lg focus:outline-none transition-all duration-300
                          ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-orange-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-orange-500'}`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-3 pl-10 rounded-lg focus:outline-none transition-all duration-300
                          ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-orange-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-orange-500'}`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} transition-colors duration-300`}>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          className={`w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 ${
                            isDark ? 'focus:ring-orange-500 focus:ring-offset-gray-800' : 'focus:ring-orange-500'
                          }`}
                          required
                        />
                      </div>
                      <label htmlFor="terms" className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        I agree to the <button type="button" className={`font-medium ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Terms of Service</button> and <button type="button" className={`font-medium ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Privacy Policy</button>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center p-3 rounded-lg focus:outline-none transition-all duration-300
                      ${isDark
                        ? 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-2 focus:ring-orange-500 focus:ring-offset-gray-800'
                        : 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-2 focus:ring-orange-600 focus:ring-offset-2'}
                      ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : "Create Account"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                    Already have an account?{" "}
                    <button
                      onClick={toLoginPage}
                      className={`font-medium transition-colors duration-300 ${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-800'}`}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx>{`
        @keyframes slideLeft {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-left {
          animation: slideLeft 0.7s ease-in-out;
        }

        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Signup;