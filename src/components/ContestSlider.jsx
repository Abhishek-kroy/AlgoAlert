import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import leetcodeLogo from "../assets/leetcode.png"
import codeforcesLogo from "../assets/codeforces.png";
import codechefLogo from "../assets/codechef.png";

const ContestSlider = ({ contests }) => {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -100, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 100, behavior: "smooth" });
        }
    };

    return (
        <div className="relative flex items-center mt-2">
            {contests.length > 1 && (
                <button className="absolute left-0 z-10 bg-gray-800 text-white p-1 rounded-full" onClick={scrollLeft}>
                    <FaChevronLeft size={16} />
                </button>
            )}
            <div ref={sliderRef} className="overflow-x-auto flex space-x-2 px-6 scrollbar-hide">
                {contests.map((contest, index) => (
                    <div key={index} className={`flex items-center px-2 py-1 rounded text-xs truncate whitespace-nowrap
                        bg-opacity-90 min-w-[120px] flex-shrink-0
                        ${contest.platform === "Codeforces" ? "bg-blue-600 text-white" : ""}
                        ${contest.platform === "CodeChef" ? "bg-gray-700 text-white" : ""}
                        ${contest.platform === "LeetCode" ? "bg-orange-500 text-white" : ""}`}>
                        <img src={contest.platform === "Codeforces" ? codeforcesLogo : 
                                  contest.platform === "CodeChef" ? codechefLogo : 
                                  leetcodeLogo} 
                             alt={contest.platform} className="h-4 w-4 mr-1" />
                        <span>{contest.title}</span>
                    </div>
                ))}
            </div>
            {contests.length > 1 && (
                <button className="absolute right-0 z-10 bg-gray-800 text-white p-1 rounded-full" onClick={scrollRight}>
                    <FaChevronRight size={16} />
                </button>
            )}
        </div>
    );
};

export default ContestSlider;
