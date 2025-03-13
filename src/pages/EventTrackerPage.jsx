import React from "react";
import Calendar from "../components/Calendar";
import ContestSearchBar from "../components/ContestSearchBar"; // 🔍 Import Search Bar
import UpcomingContests from "../components/UpcomingContests";
const EventTrackerPage = ({ isDarkMode, isMenuOpen, onContestClick, showCalendar }) => {
  return (
    <div>
      <div className="overflow-x-auto md:overflow-visible w-full mt-4">
        {showCalendar && (
          <Calendar isDarkMode={isDarkMode} isMenuOpen={isMenuOpen} onContestClick={onContestClick} />
        )}
      </div>
    </div>
  );
};

export default EventTrackerPage;
