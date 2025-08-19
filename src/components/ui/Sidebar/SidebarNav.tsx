import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calendar, ListTodo, ShoppingCart, Coins, Tag, Bell } from "lucide-react";

export interface SidebarNavProps {
  handleNavigate: () => void;
  linkPadding: string;
  labelHiddenClass: string;
  iconSize: number;
  totalNotifications: number;
  collapsed?: boolean;
}

export function SidebarNav({
  handleNavigate,
  linkPadding,
  labelHiddenClass,
  iconSize,
  totalNotifications,
  collapsed = false,
}: SidebarNavProps) {
  const mainItems = [
    { to: "/dashboard", label: "Panel", Icon: LayoutDashboard },
    { to: "/calendar", label: "Kalendarz", Icon: Calendar },
    { to: "/tasks", label: "Zadania", Icon: ListTodo },
    { to: "/shopping", label: "Zakupy", Icon: ShoppingCart },
    { to: "/payments", label: "Płatności", Icon: Coins },
  ];
  const bottomItems = [
    { to: "/labels", label: "Etykiety", Icon: Tag },
    { to: "/notifications", label: "Powiadomienia", Icon: Bell, badge: totalNotifications },
  ];

  if (collapsed) {
    return (
      <nav className="flex flex-col h-full">
        <div className="flex flex-col items-center gap-2">
          {mainItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `relative w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-bg-hover ring-1 ring-bg-hover" : "hover:bg-bg-hover"
                }`
              }>
              <Icon size={22} />
            </NavLink>
          ))}
        </div>
        <div className="mt-auto flex flex-col items-center gap-2 pt-4">
          {bottomItems.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={handleNavigate}
              className={({ isActive }) =>
                `relative w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-bg-hover ring-1 ring-bg-hover" : "hover:bg-bg-hover"
                }`
              }>
              <Icon size={22} />
              {/* {badge && badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
                </span>
              )} */}
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col h-full">
      <div>
        {mainItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `${linkPadding} py-2 rounded-md flex items-center gap-4 text-sm ${
                isActive ? "bg-bg-hover font-bold" : "hover:bg-bg-hover"
              }`
            }>
            <Icon size={iconSize} />
            <span className={`text-sm transition-all duration-200 ${labelHiddenClass}`}>{label}</span>
          </NavLink>
        ))}
      </div>
      <div className="mt-auto pt-4">
        {bottomItems.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `${linkPadding} py-2 rounded-md flex items-center gap-4 text-sm ${
                isActive ? "bg-bg-hover font-bold" : "hover:bg-bg-hover"
              }`
            }>
            <Icon size={20} />
            <span className={`text-sm transition-all duration-200 ${labelHiddenClass}`}>{label}</span>
            {/* {badge && badge > 0 && (
              <span className="ml-auto relative inline-flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full h-4 min-w-4 px-1">
                {badge > 9 ? "9+" : badge}
              </span>
            )} */}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
