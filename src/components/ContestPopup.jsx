import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import codeforcesLogo from "../assets/codeforces.png";
import codechefLogo from "../assets/codechef.png";
import leetcodeLogo from "../assets/leetcode.png";
import atcoderLogo from "../assets/atcoder.png";

const formatTime = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return "Invalid Time";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

const ContestPopup = ({ contests, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notificationsOn, setNotificationsOn] = useState(false);

  const uniqueContests = Array.from(new Map(contests.map((contest) => [contest.id, contest])).values());

  useEffect(() => {
    const contestId = uniqueContests[currentIndex]?.id;
    if (contestId) {
      const savedState = localStorage.getItem(`notify_${contestId}`);
      setNotificationsOn(savedState === "true");
    }

    const handleNotificationUpdate = () => {
      const updatedState = localStorage.getItem(`notify_${contestId}`) === "true";
      setNotificationsOn(updatedState);
    };

    window.addEventListener("notificationUpdated", handleNotificationUpdate);
    return () => window.removeEventListener("notificationUpdated", handleNotificationUpdate);
  }, [currentIndex]);

  const toggleNotification = () => {
    const contestId = uniqueContests[currentIndex]?.id;
    if (contestId) {
      const newState = !notificationsOn;
      setNotificationsOn(newState);
      localStorage.setItem(`notify_${contestId}`, newState);

      let storedContests = JSON.parse(localStorage.getItem("notifiedContests")) || [];

      if (newState) {
        if (!storedContests.some((contest) => contest.id === contestId)) {
          storedContests.push(uniqueContests[currentIndex]);
        }
      } else {
        storedContests = storedContests.filter((contest) => contest.id !== contestId);
      }

      localStorage.setItem("notifiedContests", JSON.stringify(storedContests));

      // Update notification count
      const notificationCount = storedContests.length;
      localStorage.setItem("notificationCount", notificationCount);

      // ✅ Dispatch event to sync with ContestSearchBar.jsx
      window.dispatchEvent(new Event("notificationUpdated"));
    }
  };

  const nextContest = () => setCurrentIndex((prev) => (prev + 1) % uniqueContests.length);
  const prevContest = () => setCurrentIndex((prev) => (prev - 1 + uniqueContests.length) % uniqueContests.length);

  const currentContest = uniqueContests[currentIndex];

  const platformLogos = {
    Codeforces: codeforcesLogo,
    CodeChef: codechefLogo,
    LeetCode: leetcodeLogo,
    AtCoder: atcoderLogo,
  };
  const platformLogo = platformLogos[currentContest.platform] || null;

  const formatDuration = (duration, platform) => {
    if (!duration || isNaN(duration) || duration <= 0) return "Unknown Duration";
    let totalMinutes = duration;
    if (platform === "CodeChef" || platform === "AtCoder") totalMinutes *= 60;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hours > 0 ? `${hours} hrs ${mins ? mins + " mins" : ""}` : `${mins} mins`;
  };

  const contestDuration = Number(currentContest.duration) || 0;
  let durationInMinutes = contestDuration;
  if (currentContest.platform === "CodeChef" || currentContest.platform === "AtCoder") durationInMinutes *= 60;

  const startTime = formatTime(currentContest.timestamp);
  const endTime = formatTime(currentContest.timestamp + durationInMinutes * 60 * 1000);
  const formattedDuration = formatDuration(contestDuration, currentContest.platform);

  const now = Date.now();
  const contestEnded = currentContest.timestamp + durationInMinutes * 60 * 1000 < now;
  const contestStatus = contestEnded ? "⚠ Contest Ended" : "✅ Upcoming Contest";
  const statusColor = contestEnded ? "text-red-500" : "text-green-500";

  return (
    <div
      id="popup-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => e.target.id === "popup-overlay" && onClose()}
    >
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-500 text-2xl font-bold">✖</button>

        {platformLogo && <img src={platformLogo} alt={currentContest.platform} className="w-16 h-16 mx-auto mb-2" />}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentContest.title}</h3>
        <p className="text-gray-700 dark:text-gray-300">📅 {new Date(currentContest.timestamp).toLocaleDateString()}</p>
        <p className="text-gray-700 dark:text-gray-300">⏰ {startTime} - {endTime}</p>
        <p className="text-gray-700 dark:text-gray-300">⏳ {formattedDuration}</p>
        <p className={`font-bold ${statusColor}`}>{contestStatus}</p>

        <a
          href={
            currentContest.platform === "LeetCode" && currentContest.number
              ? `https://leetcode.com/contest/${currentContest.title.toLowerCase().includes("biweekly") ? "biweekly" : "weekly"}-contest-${currentContest.number}`
              : currentContest.link || "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline flex items-center justify-center mt-2"
        >
          🔗 {currentContest.platform} Contest
        </a>

        {/* ✅ Show Notification Toggle ONLY for Future Contests */}
        {!contestEnded && (
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-600 dark:text-gray-300 mr-2">Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={notificationsOn} onChange={toggleNotification} />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-black peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all"></div>
            </label>
          </div>
        )}

        {uniqueContests.length > 1 && (
          <div className="flex justify-between mt-4">
            <button onClick={prevContest} className="text-gray-600 dark:text-white hover:text-black dark:hover:text-gray-300">
              <FaChevronLeft size={24} />
            </button>
            <button onClick={nextContest} className="text-gray-600 dark:text-white hover:text-black dark:hover:text-gray-300">
              <FaChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestPopup;
