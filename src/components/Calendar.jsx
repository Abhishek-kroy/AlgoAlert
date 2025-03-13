import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import atcoderLogo from "../assets/atcoder.png";
import leetcodeLogo from "../assets/leetcode.png"
import codeforcesLogo from "../assets/codeforces.png";
import codechefLogo from "../assets/codechef.png";
import ContestPopup from "./ContestPopup";
import ContestSearchBar from "./ContestSearchBar"; 
import UpcomingContests from "./UpcomingContests";
import ContestSlider from "./ContestSlider";

const Calendar = ({ isDarkMode }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // ✅ Separate states for Codeforces & CodeChef
    const [codeforcesContests, setCodeforcesContests] = useState([]);
    const [codechefContests, setCodechefContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);

    const [selectedContests, setSelectedContests] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("all");

    const [leetcodeContests, setLeetcodeContests] = useState([]);
    const [atcoderContests, setAtcoderContests] = useState([]);

    const [mobileView, setMobileView] = useState(window.innerWidth <= 768);
    // ✅ Fetch Codeforces & CodeChef contests
    useEffect(() => {
        const fetchAllContests = async () => {
            try {
                // ✅ Fetch Codeforces Contests
                const codeforcesResponse = await fetch("https://codeforces.com/api/contest.list");
                const codeforcesData = await codeforcesResponse.json();
                console.log("✅ Codeforces API Response:", codeforcesData);
    
                const fetchedCodeforcesContests = codeforcesData.status === "OK"
                    ? codeforcesData.result.map(contest => ({
                        id: `CF-${contest.id}`,
                        title: contest.name,
                        timestamp: contest.startTimeSeconds * 1000,
                        duration: contest.durationSeconds / 60,
                        status: contest.phase === "BEFORE" ? "Upcoming" : "Ended",
                        link: `https://codeforces.com/contest/${contest.id}`,
                        platform: "Codeforces",
                    }))
                    : [];
    
                // ✅ Fetch CodeChef Contests
                const codechefResponse = await fetch("https://algoalertbackend.onrender.com/api/v1/codechef/contests");
                const codechefData = await codechefResponse.json();
                console.log("✅ CodeChef API Response:", codechefData);
    
                const fetchedCodechefContests = codechefData?.contests?.map(contest => ({
                    id: `CC-${contest.code}`,
                    title: contest.title,
                    timestamp: contest.timestamp,
                    duration: contest.duration / 60,
                    status: "upcoming",
                    link: contest.url,
                    platform: "CodeChef",
                })) || [];
    
                // ✅ Fetch LeetCode Contests
                const leetcodeResponse = await fetch("https://algoalertbackend.onrender.com/api/v1/leetcode/contests");
                const leetcodeData = await leetcodeResponse.json();
                console.log("✅ LeetCode API Response:", leetcodeData);
    
                if (!leetcodeData.weekly || !leetcodeData.biweekly) {
                    console.error("❌ Unexpected API response:", leetcodeData);
                    return;
                }
    
                const weeklyContests = leetcodeData.weekly.contests.map(contest => ({
                    id: `LC-${contest.number}`,
                    title: contest.title,
                    timestamp: contest.timestamp,
                    duration: 90,
                    status: "upcoming",
                    link: `https://leetcode.com/contest/weekly-contest-${contest.number}`,
                    number: contest.number,
                    platform: "LeetCode",
                }));
    
                const biweeklyContests = leetcodeData.biweekly.contests.map(contest => ({
                    id: `LC-${contest.number}`,
                    title: contest.title,
                    timestamp: contest.timestamp,
                    duration: 90,
                    status: "upcoming",
                    link: `https://leetcode.com/contest/biweekly-contest-${contest.number}`,
                    number: contest.number,
                    platform: "LeetCode",
                }));
    
                const fetchedLeetcodeContests = [...weeklyContests, ...biweeklyContests];
                
                const atcoderResponse = await fetch("https://algoalertbackend.onrender.com/api/v1/AtCoder/contests");
                const atcoderData = await atcoderResponse.json();
                console.log("✅ AtCoder API Response:", atcoderData);
                console.log("✅ LeetCode Contests:", [...weeklyContests, ...biweeklyContests]);
                const fetchedAtcoderContests = atcoderData?.contests?.map(contest => ({
                    id: `AC-${contest.id}`,
                    title: contest.title,
                    timestamp: contest.timestamp,
                    duration: contest.duration / 60,
                    status: contest.timestamp > Date.now() ? "Upcoming" : "Ended",
                    link: contest.url,
                    platform: "AtCoder",
                })) || [];
                

                // ✅ Update the state to include AtCoder contests
                setAtcoderContests(fetchedAtcoderContests);

                // ✅ Set All Contests
                setCodeforcesContests(fetchedCodeforcesContests);
                setCodechefContests(fetchedCodechefContests);
                setLeetcodeContests(fetchedLeetcodeContests);
    
                console.log("✅ Fetched All Contests:", {
                    codeforces: fetchedCodeforcesContests,
                    codechef: fetchedCodechefContests,
                    leetcode: fetchedLeetcodeContests,
                });
    
            } catch (error) {
                console.error("❌ Error fetching contests:", error);
            }
        };
    
        fetchAllContests();
        const handleResize = () => setMobileView(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    

    // ✅ Combine contests & apply filters
    useEffect(() => {
        let allContests = [...codeforcesContests, ...codechefContests, ...leetcodeContests, ...atcoderContests];

        if (selectedPlatform !== "all") {
            allContests = allContests.filter(contest =>
                contest.platform.toLowerCase() === selectedPlatform.toLowerCase()
            );
        }

        if (searchTerm.trim() !== "") {
            allContests = allContests.filter(contest =>
                contest.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        console.log("🔍 Filtered Contests:", allContests);
        setFilteredContests(allContests);
    }, [searchTerm, selectedPlatform, codeforcesContests, codechefContests, leetcodeContests, atcoderContests]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const openPopup = (contest) => {
        if (!contest || !contest.title || !contest.timestamp) {
            console.error("❌ Invalid contest data:", contest);
            return; // Prevents opening popup with broken data
        }
        setSelectedContests([contest]); // ✅ Opens popup for only the clicked contest
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen p-4">
            {/* Search Bar */}
            <div className="flex justify-center w-full">
                <div className="w-full max-w-6xl mb-10">
                    <ContestSearchBar 
                        darkMode={isDarkMode} 
                        onSearch={(term, platform) => {
                            setSearchTerm(term);
                            setSelectedPlatform(platform);
                        }}
                    />
                </div>
            </div>

            {/* Layout: Upcoming Contests + Calendar */}
            <div className="flex flex-col lg:flex-row w-full max-w-10xl justify-between">
                <div className="w-full lg:w-1/3 p-4 flex flex-col h-[800px]">
                    <UpcomingContests />
                </div>

                <div className={`w-full lg:w-2/3 p-6 rounded-lg shadow-md overflow-hidden transition-all duration-300 
                    ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>

                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={prevMonth} className="hover:text-orange-500">
                            <FaChevronLeft size={24} />
                        </button>
                        <h2 className="text-lg md:text-xl font-semibold text-red-500">
                            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
                        </h2>
                        <button onClick={nextMonth} className="hover:text-orange-500">
                            <FaChevronRight size={24} />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 border">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="text-center py-3 border font-bold">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 border relative">
                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} className={`h-24 sm:h-32 border ${isDarkMode ? "bg-gray-900" : "bg-white"}`}></div>
                        ))}

                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, day) => {
                            const contestsForDay = filteredContests.filter(contest => {
                                const contestDate = new Date(contest.timestamp);
                                return contestDate.getDate() === day + 1 && contestDate.getMonth() === currentDate.getMonth() && contestDate.getFullYear() === currentDate.getFullYear();
                            });

                            return (
                                <div key={day} 
                                     className={`h-24 sm:h-32 border relative p-2 cursor-pointer 
                                         ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`} 
                                     onClick={() => openPopup(day + 1)}>
                                    <span className="absolute top-2 left-2 text-sm font-bold">{day + 1}</span>
                                    <div className="overflow-y-auto overflow-x-hidden max-h-24 sm:max-h-32 flex flex-col custom-scrollbar">
                                    <div className="mt-6 flex flex-col gap-1">
                                    {contestsForDay.map((contest, index) => (
                                        <div key={index} 
                                            className={`flex items-center px-1 py-1 rounded text-xs truncate
                                                ${contest.platform === "Codeforces" ? "bg-blue-600 text-white" : ""}
                                                ${contest.platform === "CodeChef" ? "bg-gray-700 text-white" : ""}
                                                ${contest.platform === "LeetCode" ? "bg-orange-500 text-white" : ""}
                                                ${contest.platform === "AtCoder" ? "bg-red-500 text-white" : ""}`}
                                                onClick={() => openPopup(contest)}>

                                            {/* ✅ Platform Logo (If you have an AtCoder logo, add it) */}
                                            <img src={contest.platform === "Codeforces" ? codeforcesLogo : 
                                                    contest.platform === "CodeChef" ? codechefLogo : 
                                                    contest.platform === "LeetCode" ? leetcodeLogo : 
                                                    atcoderLogo} 
                                                alt={contest.platform} className="h-4 w-4 mr-1" />

                                            <span className="truncate">{contest.title}</span>
                                        </div>
                                    ))}
                                    </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedContests && <ContestPopup contests={selectedContests} onClose={() => setSelectedContests(null)} />}
        </div>
    );
};
export default Calendar;
