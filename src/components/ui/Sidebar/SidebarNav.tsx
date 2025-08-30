import { NavLink } from "react-router-dom";
import { Calendar, ListTodo, ShoppingCart, Tag, Bell, BookOpenCheck, Banknote, LayoutGrid, TrendingUp } from "lucide-react";
import type { SidebarNavProps } from "@/data/Layout/Components/LayoutComponentInterfaces";
import { useT } from "@/hooks/useT";

export type { SidebarNavProps } from "@/data/Layout/Components/LayoutComponentInterfaces";

export function SidebarNav({
  handleNavigate,
  linkPadding,
  labelHiddenClass,
  iconSize,
  totalNotifications,
  collapsed = false,
}: SidebarNavProps) {
  const { t } = useT();
  
  const mainItems = [
    { to: "/dashboard", label: t("sidebar.dashboard"), Icon: LayoutGrid },
    { to: "/calendar", label: t("sidebar.calendar"), Icon: Calendar },
    { to: "/tasks", label: t("sidebar.tasks"), Icon: ListTodo },
    { to: "/shopping", label: t("sidebar.shopping"), Icon: ShoppingCart },
    { to: "/payments", label: t("sidebar.payments"), Icon: Banknote },
  ];
  const secondaryItems = [
    { to: "/development", label: t("sidebar.development"), Icon: TrendingUp },
  ];
  const bottomItems = [
    { to: "/labels", label: t("sidebar.labels"), Icon: Tag },
    { to: "/notifications", label: t("sidebar.notifications"), Icon: Bell, badge: totalNotifications },
    { to: "/feedback", label: t("sidebar.feedback"), Icon: BookOpenCheck, special: true },
  ];

  if (collapsed) {
    return (
      <nav className="flex flex-col h-full">
        <div className="flex flex-col items-center">
          {mainItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `relative w-16 h-16 flex flex-col items-center justify-center rounded-md transition-colors ${
                  isActive ? "bg-bg-hover" : "hover:bg-bg-hover"
                }`
              }>
              <Icon size={22} />
              <span className="text-xs text-text-light mt-1">{label}</span>
            </NavLink>
          ))}
          
          {/* Separator */}
          <div className="w-12 h-px bg-text-light/30 my-2" />
          
          {secondaryItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `relative w-16 h-16 flex flex-col items-center justify-center rounded-md transition-colors ${
                  isActive ? "bg-bg-hover" : "hover:bg-bg-hover"
                }`
              }>
              <Icon size={22} />
              <span className="text-xs text-text-light mt-1">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="mt-auto flex flex-col items-center">
          {bottomItems.map(({ to, Icon, label, special }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `relative w-14 h-14 flex items-center justify-center rounded-md transition-colors ${
                  special
                    ? isActive
                      ? "bg-orange-300 text-text ring-2 ring-orange-200"
                      : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                    : isActive
                    ? "bg-bg-hover ring-1 ring-bg-hover"
                    : "hover:bg-bg-hover"
                }`
              }>
              <Icon size={22} />
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-0.5">
        {mainItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `${linkPadding} py-1.5 rounded-md flex items-center gap-4 text-sm ${
                isActive ? "bg-bg-hover font-bold" : "hover:bg-bg-hover"
              }`
            }>
            <Icon size={iconSize} />
            <span className={`text-sm transition-all duration-200 ${labelHiddenClass}`}>{label}</span>
          </NavLink>
        ))}
        
        {/* Separator */}
        <div className="h-px bg-text-light/30 mx-2 my-2" />
        
        {secondaryItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `${linkPadding} py-1.5 rounded-md flex items-center gap-4 text-sm ${
                isActive ? "bg-bg-hover font-bold" : "hover:bg-bg-hover"
              }`
            }>
            <Icon size={iconSize} />
            <span className={`text-sm transition-all duration-200 ${labelHiddenClass}`}>{label}</span>
          </NavLink>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        {bottomItems.map(({ to, Icon, label, special }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `${linkPadding} py-2 rounded-md flex items-center gap-4 text-sm transition-colors ${
                special
                  ? isActive
                    ? "bg-orange-500 text-white font-bold"
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200 font-medium"
                  : isActive
                  ? "bg-bg-hover font-bold"
                  : "hover:bg-bg-hover"
              }`
            }>
            <Icon size={20} />
            <span className={`text-sm transition-all duration-200 ${labelHiddenClass}`}>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
