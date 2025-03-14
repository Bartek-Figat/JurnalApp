import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "h-20 bg-[#121312] shadow-md" : "h-28 bg-[#000205]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between px-6 py-8">
          {/* Logo */}
          <div className="flex items-center justify-center text-2xl font-bold text-blue-600">
            <p>Trade</p>
            <p className="text-blue-300">Keeper</p>
          </div>

          {/* Navigation Links */}

          <div className="hidden items-center lg:flex">
            {[
              "HOME",
              "ABOUT",
              "SNAPSHOT",
              "FEATURES",
              "TESTIMONIALS",
              "PRICING",
              "FAQS",
              "CONTACT",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-md px-3 py-2 text-sm font-medium text-white hover:text-blue-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Login and Sign In Buttons */}
          <div className="hidden space-x-2.5 lg:flex">
            <Link
              to="/login"
              className="rounded-md border border-gray-400 px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-black"
            >
              Login
            </Link>
            <Link
              to="/sing-in"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-300 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={toggleMobileMenu}
        ></div>
        <div
          className={`fixed right-0 top-0 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } lg:hidden`}
        >
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {[
              "HOME",
              "ABOUT",
              "SNAPSHOT",
              "FEATURES",
              "TESTIMONIALS",
              "PRICING",
              "FAQS",
              "CONTACT",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-700"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="border-t border-gray-200 px-2 pb-3 pt-4">
            <Link
              to="/login"
              className="block w-full rounded-md border border-gray-400 px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/sing-in"
              className="mt-2 block w-full rounded-md bg-blue-600 px-4 py-2 text-left text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
