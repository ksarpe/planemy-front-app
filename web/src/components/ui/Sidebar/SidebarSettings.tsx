import { FiBell, FiHelpCircle, FiSettings } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function SidebarSettings({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 w-full">
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `rounded-lg p-2 flex items-center justify-center w-full ${isActive ? "bg-bg" : "hover:bg-bg"}`
          }>
          {({ isActive }) => <FiBell size={20} className={isActive ? "text-text" : "text-text-muted"} />}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `rounded-lg p-2 flex items-center justify-center w-full ${isActive ? "bg-bg" : "hover:bg-bg"}`
          }>
          {({ isActive }) => <FiSettings size={20} className={isActive ? "text-text" : "text-text-muted"} />}
        </NavLink>
        <NavLink
          to="/help"
          className={({ isActive }) =>
            `rounded-lg p-2 flex items-center justify-center w-full ${isActive ? "bg-bg" : "hover:bg-bg"}`
          }>
          {({ isActive }) => <FiHelpCircle size={20} className={isActive ? "text-text" : "text-text-muted"} />}
        </NavLink>
      </div>
    );
  }

  return (
    <div className="flex gap-0.5 ml-2 justify-evenly">
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `rounded-lg p-2
              text-lg ${isActive ? "bg-bg" : "hover:bg-bg"}`
        }>
        {({ isActive }) => (
          <>
            <FiBell className={isActive ? "text-text" : "text-text-muted"} />
          </>
        )}
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `rounded-lg p-2
              text-lg ${isActive ? "bg-bg" : "hover:bg-bg"}`
        }>
        {({ isActive }) => (
          <>
            <FiSettings className={isActive ? "text-text" : "text-text-muted"} />
          </>
        )}
      </NavLink>
      <NavLink
        to="/help"
        className={({ isActive }) =>
          `rounded-lg p-2
              text-lg ${isActive ? "bg-bg" : "hover:bg-bg"}`
        }>
        {({ isActive }) => (
          <>
            <FiHelpCircle className={isActive ? "text-text" : "text-text-muted"} />
          </>
        )}
      </NavLink>
    </div>
  );
}
