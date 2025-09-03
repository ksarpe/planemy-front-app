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
          <span className="font-bold text-xl cursor-pointer p-2 rounded-md text-text hover:text-primary hover:bg-bg-alt">
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
              text-sm ${isActive ? "bg-bg-alt" : "hover:bg-bg-alt"}`
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
              text-sm ${isActive ? "bg-bg-alt" : "hover:bg-bg-alt"}`
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
              text-sm ${isActive ? "bg-bg-alt" : "hover:bg-bg-alt"}`
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
