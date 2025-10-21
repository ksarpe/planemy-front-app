import { FiBell, FiHelpCircle, FiSettings } from "react-icons/fi";
import { Bell, HelpCircle, Settings } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { BasicDropdown, BasicDropdownItem } from "../Common";

export default function SidebarSettings({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();

  if (collapsed) {
    return (
      <BasicDropdown
        trigger={
          <span className="font-bold text-xl cursor-pointer p-2 rounded-md text-text hover:text-primary hover:bg-bg">
            ...
          </span>
        }
        Xalign="left"
        Yalign="top">
        <BasicDropdownItem icon={Bell} onClick={() => {navigate("/notifications")}}>
          Notifications
        </BasicDropdownItem>
        <BasicDropdownItem icon={Settings} onClick={() => {}}>
          Settings
        </BasicDropdownItem>
        <BasicDropdownItem icon={HelpCircle} onClick={() => {navigate("/help")}}>
          Help
        </BasicDropdownItem>
      </BasicDropdown>
    );
  }

  return (
    <div className="flex gap-0.5 ml-2">
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `rounded-md p-2
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
          `rounded-md p-2
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
          `rounded-md p-2
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
