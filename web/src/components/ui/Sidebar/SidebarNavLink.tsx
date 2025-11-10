import type { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface SidebarNavLinkProps {
  to: string;
  label: string;
  Icon: IconType;
  onClick?: () => void;
  collapsed?: boolean;
}

export function SidebarNavLink({ to, label, Icon, onClick, collapsed = false }: SidebarNavLinkProps) {
  if (collapsed) {
    // COLLAPSED VERSION
    return (
      <NavLink
        to={to}
        title={label}
        onClick={onClick}
        className={({ isActive }) =>
          `w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-bg-secondary active:scale-95 ${
            isActive ? "bg-primary/10  text-primary" : "text-text-muted"
          }`
        }>
        <Icon size={20} />
      </NavLink>
    );
  }
  // EXPANDED VERSION
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `p-2 rounded-2xl flex hover:bg-bg-secondary items-center justify-center active:scale-95 overflow-hidden ${
          isActive ? "bg-primary/10 " : ""
        }`
      }>
      {({ isActive }) => (
        <span
          className={`flex items-center justify-start w-full h-full gap-2 ${
            isActive ? "text-primary" : "text-text-muted"
          }`}>
          <Icon size={20} />
          <span className="text-sm font-medium">{label}</span>
        </span>
      )}
    </NavLink>
  );
}
