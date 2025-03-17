import {
  Home,
  BarChart,
  FileText,
  Book,
  RefreshCw,
  Users,
  Bell,
  User,
  Settings,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import SiteLogo from "./SiteLogo";
import SiteLogoWithoutText from "./SiteLogoWithoutText";
import NavLinkComponent from "./NavLinkComponent";
import { useDarkMode } from "../../../contexts/DarkModeContext";

export const Sidebar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    // ... existing code ...
    <div
      className={`lg:min-w-65 min-w-19 min-w-0 transition-all max-md:hidden sm:min-w-10 ${isDarkMode ? "bg-[#151822]" : "bg-white"} h-screen`} // Added h-screen
    >
      <div
        className={`lg:min-w-65 flex h-full flex-col justify-between border-r border-gray-200 p-6 text-sm font-semibold transition-colors duration-300 max-lg:px-4 ${isDarkMode ? "dark:border-[#212737] dark:bg-[#151822]" : "border-gray-200 bg-white"}`}
      >
        <div className="flex flex-col gap-6">
          <SiteLogo className="hidden h-10 w-full text-black dark:text-[#6B7591] lg:block" />
          <SiteLogoWithoutText className="hidden size-max max-lg:block" />
          <hr
            className={`border-gray-200 ${isDarkMode ? "dark:border-[#212737]" : "border-gray-200"}`}
          />
          <div className="flex flex-col gap-2">
            <NavLinkComponent
              to="create-trade"
              label="Create Trade"
              Icon={FileText}
            />
            <NavLinkComponent to="/dashboard" label="Dashboard" Icon={Home} />
            <NavLinkComponent
              to="/analytics"
              label="Analytics"
              Icon={BarChart}
            />
            <NavLinkComponent
              to="/lightweight"
              label="Lightweight"
              Icon={RefreshCw}
            />
            <NavLinkComponent to="/tutorials" label="Tutorials" Icon={Book} />
            <NavLinkComponent
              to="/changelog"
              label="Changelog"
              Icon={FileText}
            />
            <NavLinkComponent
              to="/community-support"
              label="Community Support"
              Icon={Users}
            />
          </div>
        </div>
        <hr
          className={`border-gray-200 ${isDarkMode ? "dark:border-[#212737]" : "border-gray-200"}`}
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <NavLinkComponent
              to="/notifications"
              label="Notifications"
              Icon={Bell}
            />
            <NavLinkComponent to="/my-account" label="My Account" Icon={User} />
          </div>

          <hr
            className={`border-gray-200 ${isDarkMode ? "dark:border-[#212737]" : "border-gray-200"}`}
          />

          <div className="flex flex-col gap-2">
            <NavLinkComponent to="/settings" label="Settings" Icon={Settings} />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center rounded p-2 text-gray-700 hover:bg-blue-300 dark:text-[#6B7591] dark:hover:bg-[#212737]"
            title="Logout"
          >
            <LogOut className="mr-2" />
            <span className="hidden font-medium text-gray-700 dark:text-[#6B7591] lg:inline">
              Logout
            </span>
          </button>
          <hr
            className={`border-gray-200 ${isDarkMode ? "dark:border-[#212737]" : "border-gray-200"}`}
          />
          <button
            onClick={toggleDarkMode}
            className="flex items-center rounded p-2 text-gray-700 hover:bg-blue-300 dark:text-[#6B7591] dark:hover:bg-[#212737]"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
            <span className="hidden font-medium text-gray-700 dark:text-[#6B7591] lg:inline">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>
    </div>
    // ... existing code ...
  );
};
