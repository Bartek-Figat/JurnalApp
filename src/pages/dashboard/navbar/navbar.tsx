import { useState } from "react";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-md md:hidden dark:bg-[#151822]">
      <div className="flex items-center justify-between p-4">
        <div className="text-lg font-bold">My App</div>
        <button onClick={toggleMenu} className="lg:hidden">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {isOpen && (
        <div
          className={`flex h-screen flex-col bg-white p-4 transition-all duration-300 ease-in-out lg:hidden dark:bg-[#151822] ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden lg:hidden`}
        >
          <a href="#home" className="py-2">
            Home
          </a>
          <a href="#about" className="py-2">
            About
          </a>
          <a href="#services" className="py-2">
            Services
          </a>
          <a href="#contact" className="py-2">
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};
