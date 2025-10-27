import React from "react";
import { NavLink } from "react-router-dom";

const IconFind = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35"
    />
    <circle
      cx="11"
      cy="11"
      r="6"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="1.5" />
    <path
      d="M16 3v4M8 3v4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconRecords = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      d="M3 7h18"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="3" y="7" width="18" height="14" rx="2" strokeWidth="1.5" />
  </svg>
);

const IconProfile = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="8" r="3" strokeWidth="1.5" />
    <path
      d="M6 20c1.5-3 4.5-4 6-4s4.5 1 6 4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Footer() {
  const baseClass = "w-6 h-6";
  const activeText = "text-[#29C1C3]";
  const inactiveText = "text-black"; // 👈 icon color black

  return (
    <nav className="bg-gray-100 border-t border-gray-300 fixed bottom-0 left-0 right-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto">
        {/* 👇 Equal columns using grid */}
        <div className="grid grid-cols-4 text-center py-3 px-2 md:px-0">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? activeText : inactiveText
              }`
            }
          >
            <IconFind className={`${baseClass} mb-1`} />
            <span className="text-[11px]">Find</span>
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? activeText : inactiveText
              }`
            }
          >
            <IconCalendar className={`${baseClass} mb-1`} />
            <span className="text-[11px]">Appoint.</span>
          </NavLink>

          <NavLink
            to="/records"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? activeText : inactiveText
              }`
            }
          >
            <IconRecords className={`${baseClass} mb-1`} />
            <span className="text-[11px]">Records</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? activeText : inactiveText
              }`
            }
          >
            <IconProfile className={`${baseClass} mb-1`} />
            <span className="text-[11px]">Profile</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
