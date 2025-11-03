import type { SidebarNavProps } from "@shared/data/Layout/Components/LayoutComponentInterfaces";
import { useT } from "@shared/hooks/utils/useT";
import { FaRegFaceGrimace } from "react-icons/fa6";
import { FiCalendar, FiDollarSign, FiHome, FiList, FiTag, FiTrendingUp } from "react-icons/fi";

import { NavLink } from "react-router-dom";

export type { SidebarNavProps } from "@shared/data/Layout/Components/LayoutComponentInterfaces";

export function SidebarNav({ handleNavigate, collapsed = false }: SidebarNavProps) {
  const { t } = useT();

  const navigationItems = [
    { to: "/", label: t("sidebar.dashboard"), Icon: FiHome },
    { to: "/calendar", label: t("sidebar.calendar"), Icon: FiCalendar },
    { to: "/tasks", label: t("sidebar.tasks"), Icon: FiList },
    //{ to: "/shopping", label: t("sidebar.shopping"), Icon: FiShoppingBag },
    { to: "/payments", label: t("sidebar.payments"), Icon: FiDollarSign },
  ];
  const personalItems = [
    { to: "/development", label: t("sidebar.development"), Icon: FiTrendingUp },
    { to: "/", label: "Buddy", Icon: FaRegFaceGrimace },
  ];
  const utilsItems = [
    { to: "/labels", label: t("sidebar.labels"), Icon: FiTag },
    //{ to: "/feedback", label: t("sidebar.feedback"), Icon: FiBookOpen },
  ];

  if (collapsed) {
    return (
      <nav className="flex flex-col h-full">
        <div className="flex flex-col items-center">
          {navigationItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `mb-2 relative w-12 h-12 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "shadow-[inset_5px_4px_6px_var(--color-button-active-shadow)]"
                    : "shadow-[10px_6px_12px] shadow-button-active-shadow hover:shadow-[6px_4px_8px] hover:shadow-button-active-shadow"
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={24} className={isActive ? "text-text" : "text-text-muted"} />
                </>
              )}
            </NavLink>
          ))}
          {personalItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `mb-2 relative w-12 h-12 flex flex-col items-center justify-center rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "shadow-[inset_5px_4px_6px_var(--color-button-active-shadow)]"
                    : "shadow-[10px_6px_12px] shadow-button-active-shadow hover:shadow-[6px_4px_8px] hover:shadow-button-active-shadow"
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={24} className={isActive ? "text-text" : "text-text-muted"} />
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="mt-auto flex flex-col items-center">
          {utilsItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `mb-2 relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "shadow-[inset_5px_4px_6px_var(--color-button-active-shadow)]"
                    : "shadow-[10px_6px_12px] shadow-button-active-shadow hover:shadow-[6px_4px_8px] hover:shadow-button-active-shadow"
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={24} className={isActive ? "text-text" : "text-text-muted"} />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col h-full justify-between">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-text-muted">NAVIGATION</span>

        {navigationItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `p-2 mb-2 rounded-2xl flex items-center gap-4 text-sm transition-all duration-200 ${
                isActive
                  ? "shadow-[inset_5px_4px_6px_var(--color-button-active-shadow)]"
                  : "shadow-[6px_6px_6px] shadow-button-active-shadow hover:shadow-[6px_4px_8px] hover:shadow-button-active-shadow"
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={24} className={isActive ? "text-text" : "text-text-muted"} />
                <span className={`text-sm ${isActive ? "text-text" : "text-text-muted"}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        <span className="text-xs font-bold text-text-muted mt-8">PERSONAL</span>

        {personalItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `p-2 mb-2 rounded-2xl flex items-center gap-4 text-sm transition-all duration-200 ${
                isActive
                  ? "shadow-[inset_5px_4px_6px_var(--color-button-active-shadow)]"
                  : "shadow-[10px_6px_12px] shadow-button-active-shadow hover:shadow-[6px_4px_8px] hover:shadow-button-active-shadow"
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={24} className={isActive ? "text-text" : "text-text-muted"} />
                <span className={`text-sm ${isActive ? "text-text" : "text-text-muted"}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-text-muted">UTILS</span>

        {utilsItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `p-2 mb-2 rounded-2xl flex items-center gap-4 text-sm transition-all duration-200 ${
                isActive
                  ? "shadow-[inset_5px_4px_6px_var(--color-button-active-shadow)]"
                  : "shadow-[10px_6px_12px] shadow-button-active-shadow hover:shadow-[6px_4px_8px] hover:shadow-button-active-shadow"
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={24} className={isActive ? "text-text" : "text-text-muted"} />
                <span className={`text-sm ${isActive ? "text-text" : "text-text-muted"}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
