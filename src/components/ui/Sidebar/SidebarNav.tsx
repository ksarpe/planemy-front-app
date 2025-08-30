import { NavLink } from "react-router-dom";
import { Calendar, ListTodo, ShoppingCart, Tag, Bell, BookOpenCheck, Banknote, LayoutGrid } from "lucide-react";
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
  const bottomItems = [
    { to: "/labels", label: t("sidebar.labels"), Icon: Tag },
    { to: "/notifications", label: t("sidebar.notifications"), Icon: Bell, badge: totalNotifications },
    { to: "/feedback", label: t("sidebar.feedback"), Icon: BookOpenCheck },
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
        </div>
        <div className="mt-auto flex flex-col items-center">
          {bottomItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `relative w-14 h-14 flex items-center justify-center rounded-md transition-colors ${
                  isActive ? "bg-bg-hover ring-1 ring-bg-hover" : "hover:bg-bg-hover"
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
      </div>
      <div className="flex flex-col gap-0.5">
        {bottomItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `${linkPadding} py-2 rounded-md flex items-center gap-4 text-sm transition-colors ${
                isActive ? "bg-bg-hover font-bold" : "hover:bg-bg-hover"
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
