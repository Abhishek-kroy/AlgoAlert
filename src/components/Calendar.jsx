import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaSync, FaCalendarAlt } from "react-icons/fa";
import atcoderLogo from "../assets/atcoder.png";
import leetcodeLogo from "../assets/leetcode.png";
import codeforcesLogo from "../assets/codeforces.png";
import codechefLogo from "../assets/codechef.png";
import ContestPopup from "./ContestPopup";
import ContestSearchBar from "./ContestSearchBar";
import UpcomingContests from "./UpcomingContests";

// API endpoints
const CF_URL = "https://codeforces.com/api/contest.list";
const CC_URL = "https://algoalertbackend.onrender.com/api/v1/codechef/contests";
const LC_URL = "https://algoalertbackend.onrender.com/api/v1/leetcode/contests";
const AC_URL = "https://algoalertbackend.onrender.com/api/v1/AtCoder/contests";

// Cache expiration time (in milliseconds) - set to 3 hours
const CACHE_EXPIRY = 3 * 60 * 60 * 1000;

const Calendar = ({ isDarkMode }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [codeforcesContests, setCodeforcesContests] = useState([]);
    const [codechefContests, setCodechefContests] = useState([]);
    const [leetcodeContests, setLeetcodeContests] = useState([]);
    const [atcoderContests, setAtcoderContests] = useState([]);

    const [filteredContests, setFilteredContests] = useState([]);
    const [selectedContests, setSelectedContests] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("all");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mobileView, setMobileView] = useState(window.innerWidth <= 768);
    const [lastFetched, setLastFetched] = useState(null);
    const [isForceRefresh, setIsForceRefresh] = useState(false);

    // Process contest data for each platform
    const processCodeforcesData = useCallback((data) => {
        if (data.status !== "OK") return [];
        return data.result
            .filter(c => c.phase === "BEFORE" || (Date.now() - c.startTimeSeconds * 1000) < 86400000) // Only show contests that haven't started or ended within last 24h
            .map(c => ({
                id: `CF-${c.id}`,
                title: c.name,
                timestamp: c.startTimeSeconds * 1000,
                duration: c.durationSeconds / 60,
                status: c.phase === "BEFORE" ? "Upcoming" : "Ended",
                link: `https://codeforces.com/contest/${c.id}`,
                platform: "Codeforces",
            }));
    }, []);

    const processCodechefData = useCallback((data) => {
        return data.contests?.map(c => ({
            id: `CC-${c.code}`,
            title: c.title,
            timestamp: c.timestamp,
            duration: c.duration / 60,
            status: "Upcoming",
            link: c.url,
            platform: "CodeChef",
        })) || [];
    }, []);

    const processLeetcodeData = useCallback((data) => {
        const wl = data.weekly?.contests || [];
        const bi = data.biweekly?.contests || [];
        return [...wl, ...bi].map(c => ({
            id: `LC-${c.number}`,
            title: c.title,
            timestamp: c.timestamp,
            duration: 90,
            status: "Upcoming",
            link: `https://leetcode.com/contest/${c.type}-contest-${c.number}`,
            platform: "LeetCode",
        }));
    }, []);

    const processAtcoderData = useCallback((data) => {
        return data.contests?.map(c => ({
            id: `AC-${c.id}`,
            title: c.title,
            timestamp: c.timestamp,
            duration: c.duration / 60,
            status: c.timestamp > Date.now() ? "Upcoming" : "Ended",
            link: c.url,
            platform: "AtCoder",
        })) || [];
    }, []);

    // Load data from localStorage
    const loadFromCache = useCallback(() => {
        try {
            const cached = localStorage.getItem('contestData');
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                const now = Date.now();
                // Check if cache is still valid
                if (now - timestamp < CACHE_EXPIRY) {
                    setCodeforcesContests(data.codeforces || []);
                    setCodechefContests(data.codechef || []);
                    setLeetcodeContests(data.leetcode || []);
                    setAtcoderContests(data.atcoder || []);
                    setLastFetched(timestamp);
                    return true;
                }
            }
            return false;
        } catch (err) {
            console.error("Cache loading error:", err);
            return false;
        }
    }, []);

    // Save data to localStorage
    const saveToCache = useCallback((data) => {
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem('contestData', JSON.stringify(cacheData));
            setLastFetched(cacheData.timestamp);
        } catch (err) {
            console.error("Cache saving error:", err);
        }
    }, []);

    // Fetch data from all platforms in parallel
    const fetchAllData = useCallback(async (forceRefresh = false) => {
        // Use cache if available and not forcing refresh
        if (!forceRefresh && loadFromCache()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch all in parallel
            const [cfRes, ccRes, lcRes, acRes] = await Promise.all([
                fetch(CF_URL),
                fetch(CC_URL),
                fetch(LC_URL),
                fetch(AC_URL)
            ]);

            // Process all results in parallel
            const [cfData, ccData, lcData, acData] = await Promise.all([
                cfRes.json(),
                ccRes.json(),
                lcRes.json(),
                acRes.json()
            ]);

            // Process data
            const cfContests = processCodeforcesData(cfData);
            const ccContests = processCodechefData(ccData);
            const lcContests = processLeetcodeData(lcData);
            const acContests = processAtcoderData(acData);

            // Update state
            setCodeforcesContests(cfContests);
            setCodechefContests(ccContests);
            setLeetcodeContests(lcContests);
            setAtcoderContests(acContests);

            // Save to cache
            saveToCache({
                codeforces: cfContests,
                codechef: ccContests,
                leetcode: lcContests,
                atcoder: acContests
            });
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Failed to fetch contest data. Please try again.");
        } finally {
            setLoading(false);
            setIsForceRefresh(false);
        }
    }, [processCodeforcesData, processCodechefData, processLeetcodeData, processAtcoderData, loadFromCache, saveToCache]);

    // Initial data load
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Force refresh handler
    const handleRefresh = () => {
        setIsForceRefresh(true);
        fetchAllData(true);
    };

    // Filter contests based on search and platform
    useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        let all = [...codeforcesContests, ...codechefContests, ...leetcodeContests, ...atcoderContests];

        // Sort by timestamp
        all.sort((a, b) => a.timestamp - b.timestamp);

        if (selectedPlatform !== "all") {
            all = all.filter(c => c.platform.toLowerCase() === selectedPlatform.toLowerCase());
        }

        if (term) {
            all = all.filter(c => c.title.toLowerCase().includes(term));
        }

        setFilteredContests(all);
    }, [searchTerm, selectedPlatform, codeforcesContests, codechefContests, leetcodeContests, atcoderContests]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setMobileView(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Calendar navigation
    const prevMonth = useCallback(() => {
        setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }, []);

    const nextMonth = useCallback(() => {
        setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }, []);

    const goToCurrentMonth = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    // Open contest details popup
    const openPopup = useCallback(contest => {
        if (!contest?.title && Number.isInteger(contest)) {
            // If clicked on a date, find all contests for that day
            const day = contest;
            const dayContests = filteredContests.filter(c => {
                const contestDate = new Date(c.timestamp);
                return contestDate.getDate() === day &&
                    contestDate.getMonth() === currentDate.getMonth() &&
                    contestDate.getFullYear() === currentDate.getFullYear();
            });

            if (dayContests.length > 0) {
                setSelectedContests(dayContests);
            }
        } else if (contest?.title && contest.timestamp) {
            // If clicked on a specific contest
            setSelectedContests([contest]);
        }
    }, [filteredContests, currentDate]);

    // Get days in month for calendar grid
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get day of week for the first day of month (0-6, where 0 is Sunday)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Generate calendar grid
    const generateCalendarGrid = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const today = new Date();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        // Empty cells for days before the first day of month
        const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className={`h-24 sm:h-32 border ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}></div>
        ));

        // Cells for each day of the month
        const dayCells = Array.from({ length: daysInMonth }, (_, day) => {
            const isToday =
                today.getDate() === day + 1 &&
                today.getMonth() === month &&
                today.getFullYear() === year;

            const contestsForDay = filteredContests.filter(contest => {
                const contestDate = new Date(contest.timestamp);
                return contestDate.getDate() === day + 1 &&
                    contestDate.getMonth() === month &&
                    contestDate.getFullYear() === year;
            });

            return (
                <div key={day}
                    className={`h-24 sm:h-32 border relative p-2 cursor-pointer transition-all hover:bg-opacity-20
            ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}
            ${isToday ? (isDarkMode ? "bg-blue-900 bg-opacity-30" : "bg-blue-100") : ""}`}
                    onClick={() => openPopup(day + 1)}>

                    {/* Day number */}
                    <span className={`absolute top-2 left-2 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center
            ${isToday ? "bg-blue-500 text-white" : ""}`}>
                        {day + 1}
                    </span>

                    {/* Contest list for this day */}
                    <div className="overflow-y-auto overflow-x-hidden max-h-20 sm:max-h-28 flex flex-col custom-scrollbar mt-8">
                        {contestsForDay.map((contest, index) => (
                            <div key={index}
                                className={`flex items-center px-1 py-1 my-0.5 rounded text-xs truncate hover:opacity-90 transition-all
                  shadow-sm ${isDarkMode ? "shadow-black" : "shadow-gray-300"}
                  ${contest.platform === "Codeforces" ? "bg-blue-600 text-white" : ""}
                  ${contest.platform === "CodeChef" ? "bg-gray-700 text-white" : ""}
                  ${contest.platform === "LeetCode" ? "bg-yellow-500 text-black" : ""}
                  ${contest.platform === "AtCoder" ? "bg-red-500 text-white" : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openPopup(contest);
                                }}>

                                {/* Platform Logo */}
                                <img src={
                                    contest.platform === "Codeforces" ? codeforcesLogo :
                                        contest.platform === "CodeChef" ? codechefLogo :
                                            contest.platform === "LeetCode" ? leetcodeLogo :
                                                atcoderLogo
                                }
                                    alt={contest.platform} className="h-4 w-4 mr-1" />

                                {/* Contest time */}
                                <span className="mr-1 font-bold">{new Date(contest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                                {/* Contest title */}
                                <span className="truncate">{contest.title}</span>
                            </div>
                        ))}

                        {contestsForDay.length > 0 && contestsForDay.length <= 2 && (
                            <div className="mt-1 text-xs text-right">
                                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {contestsForDay.length} contest{contestsForDay.length > 1 ? 's' : ''}
                                </span>
                            </div>
                        )}

                        {contestsForDay.length > 2 && (
                            <div className="mt-1 text-xs text-right font-medium">
                                <span className={`px-2 py-0.5 rounded-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}>
                                    {contestsForDay.length} contests
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
        });

        return [...emptyCells, ...dayCells];
    };

    // Format time since last fetch
    const getTimeSinceLastFetch = () => {
        if (!lastFetched) return "Never";

        const diff = Date.now() - lastFetched;
        if (diff < 60000) return "Just now";
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return `${Math.floor(diff / 86400000)} days ago`;
    };

    return (
        <div className={`flex mt-12 flex-col h-full items-center w-full min-h-screen p-4 transition-colors duration-300
      ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>


            {/* Search Bar */}
            <div className="flex justify-center w-full">
                <div className="w-full max-w-6xl mb-8 flex">
                    <ContestSearchBar
                        darkMode={isDarkMode}
                        onSearch={(term, platform) => {
                            setSearchTerm(term);
                            setSelectedPlatform(platform);
                        }}
                    />
                    <button
                        onClick={handleRefresh}
                        disabled={loading || isForceRefresh}
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${isDarkMode
                                ? "bg-blue-700 text-white hover:bg-blue-600"
                                : "bg-blue-500 text-white hover:bg-blue-600"} 
              ${(loading || isForceRefresh) ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <FaSync className={`mr-2 ${(loading || isForceRefresh) ? "animate-spin" : ""}`} />
                        {(loading || isForceRefresh) ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            {/* Error message if any */}
            {error && (
                <div className={`w-full max-w-6xl mb-4 px-4 py-3 rounded-md
          ${isDarkMode ? "bg-red-800 text-white" : "bg-red-100 text-red-700"}`}>
                    {error}
                </div>
            )}

            {/* Layout: Upcoming Contests + Calendar */}
            <div className="flex flex-col lg:flex-row w-full max-w-7xl justify-between gap-6">
                {/* Upcoming Contests Panel */}
                <div className={`w-full lg:w-1/3 p-4 rounded-lg shadow-md transition-all duration-300 mb-6 lg:mb-0
          ${isDarkMode ? "bg-gray-800 shadow-gray-900" : "bg-white shadow-gray-200"}`}>
                    <UpcomingContests
                        contests={filteredContests.filter(c => c.timestamp > Date.now()).slice(0, 10)}
                        isDarkMode={isDarkMode}
                        onContestClick={openPopup}
                    />
                </div>

                {/* Calendar Panel */}
                <div className={`w-full lg:w-2/3 p-6 rounded-lg shadow-md overflow-hidden transition-all duration-300 
          ${isDarkMode ? "bg-gray-800 text-white shadow-gray-900" : "bg-white text-black shadow-gray-200"}`}>

                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-3">
                            <button
                                onClick={prevMonth}
                                className={`p-2 rounded-full hover:bg-opacity-20 transition-all
                  ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                                aria-label="Previous month">
                                <FaChevronLeft size={20} />
                            </button>

                            <button
                                onClick={goToCurrentMonth}
                                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all text-sm
                  ${isDarkMode
                                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                                aria-label="Today">
                                <FaCalendarAlt size={14} />
                                <span>Today</span>
                            </button>
                        </div>

                        <h2 className={`text-xl md:text-2xl font-semibold
              ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
                        </h2>

                        <button
                            onClick={nextMonth}
                            className={`p-2 rounded-full hover:bg-opacity-20 transition-all
                ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                            aria-label="Next month">
                            <FaChevronRight size={20} />
                        </button>
                    </div>

                    {/* Days of Week Header */}
                    <div className={`grid grid-cols-7 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className={`text-center py-3 font-bold text-sm
                ${day === "Sun" || day === "Sat"
                                    ? (isDarkMode ? "text-red-400" : "text-red-500")
                                    : (isDarkMode ? "text-gray-300" : "text-gray-700")}`}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 relative">
                        {generateCalendarGrid()}
                    </div>
                </div>
            </div>

            {/* Contest Popup */}
            {selectedContests && (
                <ContestPopup
                    contests={selectedContests}
                    onClose={() => setSelectedContests(null)}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    );
};

export default Calendar;