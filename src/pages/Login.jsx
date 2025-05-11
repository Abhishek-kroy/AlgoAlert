import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Calendar, Clock, Code, ListChecks, TrendingUp, Bell, Trophy, Bookmark, User, Calculator } from "lucide-react";

const Login = ({ isDarkMode, isMenuOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  
  const navigate = useNavigate();

  // Animation for features and welcome message
  useEffect(() => {
    // Start the slide-in animation for the right panel
    setTimeout(() => {
      setShowRightPanel(true);
    }, 300);
    
    // Show welcome message after right panel appears
    setTimeout(() => {
      setShowWelcome(true);
    }, 800);
    
    // Start feature animations after welcome message
    const interval = setInterval(() => {
      setAnimationIndex(prev => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toSignupPage = () => {
    navigate('/signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check for empty fields
    if (!email || !password) {
      setError("Both fields are required!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://algoalertbackend.onrender.com/api/v1/login", {
        email,
        password,
      });       
      
      console.log("Login Response: ", response);

      if (response.data.success) {
        // Store token
        localStorage.setItem("token", response.data.token);
        
        // Store user info
        if (response.data.user) {
          const userInfo = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email
          };
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        
        // Redirect to home page
        navigate("/");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error: ", err);
      setError(err.response?.data?.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Coding stickers/icons for decorative elements
  const stickers = [
    { icon: <Code />, position: "top-10 right-10", delay: 1.2, size: "w-8 h-8" },
    { icon: <Trophy />, position: "bottom-20 right-12", delay: 1.5, size: "w-10 h-10" },
    { icon: <Bell />, position: "top-32 right-24", delay: 1.8, size: "w-9 h-9" },
    { icon: <Calculator />, position: "bottom-40 right-28", delay: 2.1, size: "w-7 h-7" },
    { icon: <User />, position: "top-64 right-8", delay: 2.4, size: "w-8 h-8" }
  ];

  // Features for the right panel
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Contest Calendar",
      description: "Never miss a coding competition with our comprehensive contest schedule.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Notifications",
      description: "Get timely alerts before contests from Codeforces, LeetCode, and more.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <ListChecks className="w-6 h-6" />,
      title: "Question Tracker",
      description: "Track your progress with solved problems and completion statistics.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Profile Analytics",
      description: "Visualize your coding progress and identify areas for improvement.",
      color: "text-orange-500 dark:text-orange-400"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Rating Predictions",
      description: "Get insights on how contests might affect your competitive programming rating.",
      color: "text-orange-500 dark:text-orange-400"
    }
  ];

  // Determine theme-based classes
  const isDark = isDarkMode;
  
  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      {/* Additional padding to account for fixed navbar */}
      <div className="pt-20"></div>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl animate-fadeIn">
          <div className={`flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-2xl 
            ${isDark ? 'bg-gray-800 shadow-orange-900/20' : 'bg-white shadow-gray-200/50'} 
            transition-all duration-300 transform hover:scale-[1.01]`}>
            
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
                  Welcome Back
                </h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 transition-colors duration-300`}>
                  Sign in to continue your coding journey
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="group">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full p-3 rounded-lg focus:outline-none transition-all duration-300
                        ${isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-orange-500'}`}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                        Password
                      </label>
                      <a href="/forgot-password" className={`text-sm ${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-800'} transition-colors duration-300`}>
                        Forgot Password?
                      </a>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-3 rounded-lg focus:outline-none transition-all duration-300
                        ${isDark 
                          ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-orange-500'}`}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <div className={`p-3 rounded-lg text-sm ${isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'} animate-pulse transition-colors duration-300`}>
                      {error}
                    </div>
                  )}

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
                        Signing In...
                      </span>
                    ) : "Sign In"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                    Don't have an account?{" "}
                    <button 
                      onClick={toSignupPage} 
                      className={`font-medium transition-colors duration-300 ${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-800'}`}
                    >
                      Create account
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Features and Info with slide-in animation */}
            <div 
              className={`w-full lg:w-1/2 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-orange-900 to-amber-900' : 'bg-gradient-to-br from-orange-500 to-amber-600'} p-8 lg:p-12 text-white
                transform transition-all duration-700 ease-out ${showRightPanel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
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
              
              {/* Coding stickers/icons */}
              {stickers.map((sticker, index) => (
                <div 
                  key={index}
                  className={`absolute ${sticker.position} ${sticker.size} text-white opacity-0 animate-fadeInSticker`}
                  style={{ 
                    animationDelay: `${sticker.delay}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="p-2 bg-white/20 rounded-full hover:rotate-12 transition-transform duration-300">
                    {sticker.icon}
                  </div>
                </div>
              ))}
              
              <div className="max-w-md mx-auto relative z-10">
                {/* Welcome message with animation */}
                <div className={`transform transition-all duration-700 ease-out ${showWelcome ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <h2 className="text-3xl font-bold mb-2">Welcome to AlgoAlert</h2>
                  <div className="h-1 w-20 bg-yellow-400 rounded-full mb-6 animate-pulse"></div>
                  <p className="text-orange-100 mb-8">
                    Join thousands of competitive programmers who never miss a contest and track their progress with our comprehensive tools.
                  </p>
                </div>

                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start space-x-4 p-3 rounded-lg transition-all duration-500 transform
                        ${animationIndex === index ? 'scale-105 bg-white/10' : 'scale-100 bg-transparent'}`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${feature.color} ${animationIndex === index ? 'animate-pulse bg-white' : 'bg-white'}`}>
                        <div className="transform transition-transform duration-500 hover:rotate-12">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-orange-100">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 transform transition-all duration-700 ease-out delay-500 translate-y-0 opacity-100">
                  <button 
                    onClick={toSignupPage}
                    className="group flex items-center text-white font-medium hover:underline"
                  >
                    Create a free account 
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx>{`
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
        
        @keyframes fadeInSticker {
          from { opacity: 0; transform: scale(0.5) rotate(-20deg); }
          to { opacity: 0.8; transform: scale(1) rotate(0); }
        }
        
        .animate-fadeInSticker {
          animation: fadeInSticker 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;