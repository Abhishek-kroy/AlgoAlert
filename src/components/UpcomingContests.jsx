import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineCalendarToday } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";

const platformIcons = {
  Codeforces: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/codeforces.svg",
  CodeChef: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/codechef.svg",
  LeetCode: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/leetcode.svg",
  AtCoder: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/atcoder.svg",
};

const UpcomingContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const sources = [
          { url: "https://codeforces.com/api/contest.list", platform: "Codeforces" },
          { url: "https://algoalertbackend.onrender.com/api/v1/codechef/contests", platform: "CodeChef" },
          { url: "https://algoalertbackend.onrender.com/api/v1/leetcode/contests", platform: "LeetCode" },
          { url: "https://algoalertbackend.onrender.com/api/v1/AtCoder/contests", platform: "AtCoder" },
        ];

        const results = await Promise.all(
          sources.map(async ({ url, platform }) => {
            try {
              const response = await fetch(url);
              const data = await response.json();

              let contestsData = [];
              if (platform === "Codeforces" && data.result) {
                contestsData = data.result
                  .filter((contest) => contest.phase === "BEFORE")
                  .map((contest) => ({
                    title: contest.name,
                    timestamp: contest.startTimeSeconds * 1000,
                    duration: contest.durationSeconds / 60,
                    url: `https://codeforces.com/contests/${contest.id}`,
                    platform,
                  }));
              } else if (platform === "CodeChef" && Array.isArray(data.contests)) {
                contestsData = data.contests.map((contest) => ({
                  title: contest.title,
                  timestamp: contest.timestamp,
                  duration: contest.duration,
                  url: contest.url,
                  platform,
                }));
              } else if (platform === "LeetCode" && data.weekly) {
                contestsData = [...data.weekly.contests, ...data.biweekly.contests].map((contest) => ({
                  title: contest.title,
                  timestamp: contest.timestamp,
                  duration: 90,
                  url: "https://leetcode.com/contest/",
                  platform,
                }));
              } else if (platform === "AtCoder" && Array.isArray(data.contests)) {
                contestsData = data.contests.map((contest) => ({
                  title: contest.title,
                  timestamp: contest.timestamp,
                  duration: contest.duration,
                  url: contest.url,
                  platform,
                }));
              }

              return contestsData;
            } catch (err) {
              console.error(`Error fetching ${platform} contests:`, err);
              return [];
            }
          })
        );

        const allContests = results.flat();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const upcomingContests = allContests
          .filter((contest) => {
            const contestDate = new Date(contest.timestamp);
            return (
              contestDate.getFullYear() === currentYear &&
              contestDate.getMonth() === currentMonth &&
              contest.timestamp > now.getTime()
            );
          })
          .sort((a, b) => a.timestamp - b.timestamp);

        setContests(upcomingContests);
      } catch (error) {
        console.error("Failed to fetch contest data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) {
    return <p className="text-black dark:text-white text-center">Loading upcoming contests...</p>;
  }

  if (contests.length === 0) {
    return <p className="text-black dark:text-white text-center">No upcoming contests this month.</p>;
  }

  const groupByDate = (contestList) => {
    return contestList.reduce((acc, contest) => {
      const dateKey = new Date(contest.timestamp).toLocaleDateString("en-GB");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(contest);
      return acc;
    }, {});
  };

  const contestsByDate = groupByDate(contests);
  
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white text-black dark:bg-gray-900 dark:text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Only upcoming contests of this month</p>

      {/* Vertical Scroll Container */}
      <div
        className="max-h-[500px] overflow-y-auto pr-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
        }}
      >
        {Object.entries(contestsByDate).map(([date, contestList]) => (
          <div key={date} className="mb-6">
            <h3 className="text-gray-700 dark:text-gray-300 text-lg mb-2 flex items-center">
              <MdOutlineCalendarToday className="mr-2" /> {date}
            </h3>
            {contestList.map((contest, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500 text-xl">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(contest.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {new Date(contest.timestamp + contest.duration * 60 * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <img src={platformIcons[contest.platform]} alt={contest.platform} className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">{contest.title}</span>
                </div>
                <div className="flex items-center mt-2 space-x-4">
                  <a
                    href={`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(contest.title)}&dates=${new Date(
                      contest.timestamp
                    )
                      .toISOString()
                      .replace(/-|:|\.\d+/g, "")}/${new Date(contest.timestamp + contest.duration * 60 * 1000)
                      .toISOString()
                      .replace(/-|:|\.\d+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-400 flex items-center"
                  >
                    <AiOutlinePlusCircle className="mr-1" /> Add to Calendar
                  </a>
                  <a href={contest.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400">
                    <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingContests;
