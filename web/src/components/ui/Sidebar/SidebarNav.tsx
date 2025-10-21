import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCalendar,
  FiList,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiTag,
  FiBookOpen,
} from "react-icons/fi";
import type { SidebarNavProps } from "@shared/data/Layout/Components/LayoutComponentInterfaces";
import { useT } from "@shared/hooks/utils/useT";

export type { SidebarNavProps } from "@shared/data/Layout/Components/LayoutComponentInterfaces";

export function SidebarNav({ handleNavigate, collapsed = false }: SidebarNavProps) {
  const { t } = useT();

  const navigationItems = [
    { to: "/", label: t("sidebar.dashboard"), Icon: FiHome },
    { to: "/calendar", label: t("sidebar.calendar"), Icon: FiCalendar },
    { to: "/tasks", label: t("sidebar.tasks"), Icon: FiList },
    { to: "/shopping", label: t("sidebar.shopping"), Icon: FiShoppingBag },
    { to: "/payments", label: t("sidebar.payments"), Icon: FiDollarSign },
  ];
  const personalItems = [{ to: "/development", label: t("sidebar.development"), Icon: FiTrendingUp }];
  const utilsItems = [
    { to: "/labels", label: t("sidebar.labels"), Icon: FiTag },
    { to: "/feedback", label: t("sidebar.feedback"), Icon: FiBookOpen },
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
                `mb-0.5 relative w-12 h-12 flex flex-col items-center justify-center rounded-md transition-colors ${
                  isActive ? "bg-bg" : "hover:bg-bg"
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
                `mb-0.5 relative w-12 h-12 flex flex-col items-center justify-center rounded-md transition-colors ${
                  isActive ? "bg-bg" : "hover:bg-bg"
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
                `mb-0.5 relative w-12 h-12 flex items-center justify-center rounded-md transition-colors ${
                  isActive ? "bg-bg" : "hover:bg-bg"
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
              `p-2 mb-0.5 rounded-md flex items-center gap-4 text-sm ${isActive ? "bg-bg" : "hover:bg-bg"}`
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
              `p-2 mb-0.5 rounded-md flex items-center gap-4 text-sm ${isActive ? "bg-bg" : "hover:bg-bg"}`
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
              `p-2 mb-0.5 rounded-md flex items-center gap-4 text-sm transition-colors ${
                isActive ? "bg-bg" : "hover:bg-bg"
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
