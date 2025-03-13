import React, { useState, useEffect, useRef } from "react";
import { FaListUl } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ContestSearchBar = ({ darkMode, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [notifiedContests, setNotifiedContests] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // ✅ Load notified contests from localStorage
  useEffect(() => {
    const storedContests = JSON.parse(localStorage.getItem("notifiedContests")) || [];
    setNotifiedContests(storedContests);
  }, []);

  // ✅ Listen for updates from `ContestPopup.jsx`
  useEffect(() => {
    const updateNotifiedContests = () => {
      setNotifiedContests([...JSON.parse(localStorage.getItem("notifiedContests")) || []]);
    };

    window.addEventListener("notificationUpdated", updateNotifiedContests);

    return () => {
      window.removeEventListener("notificationUpdated", updateNotifiedContests);
    };
  }, []);

  // ✅ Search Input Change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    onSearch(value, selectedPlatform);
  };

  // ✅ Platform Change
  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setSelectedPlatform(value);
    onSearch(searchTerm, value);
  };

  // ✅ Toggle Notification Panel
  const handleIconClick = () => {
    setShowNotifications(!showNotifications);
  };

  // ✅ Close panel when clicking outside
  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-6xl px-4">
      <div className="flex flex-row items-center justify-between w-full">
        {/* Search Input */}
        <div className="relative flex w-1/2 mr-2.5">
          <input
            type="text"
            placeholder="Search Contests"
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-4 py-3 text-lg border rounded-lg shadow-sm pr-10 ${
              darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-300"
            }`}
          />
          <span className="absolute right-3 top-3 text-gray-500 text-xl">🔍</span>
        </div>

        {/* Platform Filter */}
        <div className="w-1/2 ml-2.5">
          <select
            value={selectedPlatform}
            onChange={handlePlatformChange}
            className={`w-full px-4 py-3 text-lg border rounded-lg shadow-sm ${
              darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-300"
            }`}
          >
            <option value="all">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">Codeforces</option>
            <option value="codechef">CodeChef</option>
            <option value="atcoder">AtCoder</option>
            <option value="hackerrank">HackerRank</option>
            <option value="hackerearth">HackerEarth</option>
          </select>
        </div>

        {/* 🔔 Notification Icon */}
        <div className="relative ml-4">
          <FaListUl
            className="text-3xl text-gray-600 cursor-pointer hover:text-black dark:text-white dark:hover:text-gray-300"
            onClick={handleIconClick}
          />
          {notifiedContests.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {notifiedContests.length}
            </span>
          )}
        </div>
      </div>

      {/* 🔥 Notified Contests Dropdown */}
      {showNotifications && (
        <div
          ref={notificationRef}
          className="absolute right-4 top-16 w-80 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 z-50 border dark:border-gray-700"
        >
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🔔 Notified Contests</h3>
            <IoClose className="text-xl text-gray-500 cursor-pointer" onClick={() => setShowNotifications(false)} />
          </div>
          {notifiedContests.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto">
              {notifiedContests.map((contest) => (
                <li key={contest.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                  <a
                    href={contest.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex-1"
                  >
                    {contest.title}
                  </a>
                  <button
                    onClick={() => {
                      const updatedContests = notifiedContests.filter((c) => c.id !== contest.id);
                      setNotifiedContests(updatedContests);
                      localStorage.setItem("notifiedContests", JSON.stringify(updatedContests));

                      // ❌ Ensure the toggle in ContestPopup is turned off
                      localStorage.setItem(`notify_${contest.id}`, "false");
                      window.dispatchEvent(new Event("notificationUpdated"));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">No notified contests</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContestSearchBar;
