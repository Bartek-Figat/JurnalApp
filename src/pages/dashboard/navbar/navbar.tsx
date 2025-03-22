import { useState } from "react";
import {
  Menu,
  X,
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
import { useDarkMode } from "../../../contexts/DarkModeContext";
import NavLinkComponent from "../navbar/nabBarLinks";
import { Link } from "react-router-dom";
import SiteLogo from "./SiteLogo";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-10 bg-white bg-opacity-10 shadow-md backdrop-blur-lg dark:bg-[#151822] dark:bg-opacity-50 md:hidden">
      <div className="flex items-center justify-between p-4">
        <Link
          className="flex flex-col transition-opacity duration-300 ease-in-out group-has-[input:checked]:opacity-0"
          to="/"
        >
          <SiteLogo className="text-black dark:text-white" />
        </Link>
        <button onClick={toggleMenu} className="dark:text-gray-400 lg:hidden">
          {isOpen ? (
            <X className="h-6 w-6 rotate-180 transform transition-transform duration-300 ease-in-out" />
          ) : (
            <Menu className="h-6 w-6 rotate-0 transform transition-transform duration-300 ease-in-out" />
          )}
        </button>
      </div>
      <div
        className={`flex h-screen flex-col bg-white bg-opacity-10 backdrop-blur-lg transition-all duration-300 ease-in-out dark:bg-[#151822] dark:bg-opacity-10 lg:hidden ${
          isOpen
            ? "max-h-screen bg-opacity-100 opacity-100"
            : "max-h-0 bg-opacity-0 opacity-0"
        } overflow-hidden px-10 lg:hidden`}
      >
        <NavLinkComponent to="/" label="Home" Icon={Home} />
        <NavLinkComponent
          to="create-trade"
          label="Create Trade"
          Icon={FileText}
        />
        <NavLinkComponent to="/dashboard" label="Dashboard" Icon={Home} />
        <NavLinkComponent to="analytics" label="Analytics" Icon={BarChart} />
        <NavLinkComponent
          to="/lightweight"
          label="Lightweight"
          Icon={RefreshCw}
        />
        <NavLinkComponent to="tutorials" label="Tutorials" Icon={Book} />
        <NavLinkComponent to="changelog" label="Changelog" Icon={FileText} />
        <NavLinkComponent
          to="community-support"
          label="Community Support"
          Icon={Users}
        />
        <NavLinkComponent
          to="/notifications"
          label="Notifications"
          Icon={Bell}
        />
        <NavLinkComponent to="my-account" label="My Account" Icon={User} />
        <NavLinkComponent to="settings" label="Settings" Icon={Settings} />
        <button
          onClick={handleLogout}
          className="flex items-center rounded p-2 text-gray-700 hover:bg-blue-300 dark:text-[#6B7591] dark:hover:bg-[#212737]"
          title="Logout"
        >
          <LogOut className="mr-2" />
          Logout
        </button>
        <button
          onClick={toggleDarkMode}
          className="flex items-center rounded p-2 text-gray-700 hover:bg-blue-300 dark:text-[#6B7591] dark:hover:bg-[#212737]"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
};
