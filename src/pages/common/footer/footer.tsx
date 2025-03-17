import React from "react";
import { useDarkMode } from "../../../contexts/DarkModeContext";

const Footer: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <footer
      className={`flex items-center justify-center py-6 text-center ${
        isDarkMode
          ? "bg-gradient-to-r from-[#151822] via-gray-800 to-[#1a1c1e] text-gray-300"
          : "bg-gradient-to-r from-[#111c43] via-blue-800 to-[#111c43] text-white"
      }`}
    >
      <div className="mx-auto max-w-xl">
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-center sm:space-x-4">
          <p className="hover:text-blue-200" aria-label="Terms of Service">
            Terms of Service
          </p>
          <span className="hidden sm:inline">|</span>
          <p className="hover:text-blue-200" aria-label="Privacy Policy">
            Privacy Policy
          </p>
          <span className="hidden sm:inline">|</span>
          <p className="hover:text-blue-200" aria-label="Contact Us">
            Contact Us
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
