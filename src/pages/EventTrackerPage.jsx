import React from "react";
import Calendar from "../components/Calendar";
const EventTrackerPage = ({ isDarkMode, isMenuOpen, onContestClick, showCalendar }) => {
  return (
    <div>
      <div className="overflow-x-auto md:overflow-visible w-full mt-4 h-full">
        {showCalendar && (
          <Calendar isDarkMode={isDarkMode} isMenuOpen={isMenuOpen} onContestClick={onContestClick} />
        )}
      </div>
    </div>
  );
};

export default EventTrackerPage;
