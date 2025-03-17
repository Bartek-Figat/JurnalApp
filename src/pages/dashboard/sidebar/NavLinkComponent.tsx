import React from "react";
import { NavLink } from "react-router-dom";

interface NavLinkComponentProps {
  to: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NavLinkComponent: React.FC<NavLinkComponentProps> = ({
  to,
  label,
  Icon,
}) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center rounded-lg p-3 transition-colors duration-300 ${
          isActive
            ? "bg-blue-600 text-white shadow-md dark:bg-[#0052cc] dark:text-white"
            : "hover:bg-blue-600 hover:text-white dark:text-white dark:hover:bg-[#0052cc]"
        } `
      }
    >
      <Icon className="h-5 w-5 lg:mr-3" />
      <span className="hidden font-medium lg:inline">{label}</span>
    </NavLink>
  );
};

export default NavLinkComponent;
