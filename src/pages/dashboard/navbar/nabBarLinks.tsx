import React from "react";
import { NavLink } from "react-router-dom";

interface NavLinkComponentProps {
  to: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

const NavLinkComponent: React.FC<NavLinkComponentProps> = ({
  to,
  label,
  Icon,
  onClick,
}) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `mt-2 flex items-center rounded-lg p-3 transition-all duration-300 ease-in-out ${
          isActive
            ? "transform bg-blue-600 text-white shadow-lg dark:bg-[#0052cc] dark:text-white"
            : "hover:bg-blue-600 hover:text-white dark:text-gray-300 dark:hover:bg-[#0052cc] dark:hover:text-white"
        }`
      }
      onClick={onClick}
    >
      <Icon className="mr-3 h-5 w-5" />
      <span className="inline font-medium">{label}</span>
    </NavLink>
  );
};

export default NavLinkComponent;
