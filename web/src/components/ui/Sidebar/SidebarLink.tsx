import { NavLink } from "react-router-dom";
import type { SidebarLinkProps } from "@shared/data/Layout";

export default function SidebarLink({ to, icon: Icon, label, onNavigate }: SidebarLinkProps) {
  // each navlink configuration, including default values + active/inactive styles
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `px-4 py-1.5 rounded-lg ${isActive ? "bg-bg-hover  font-bold" : "hover:bg-bg-hover "}`
      }>
      <span className="flex items-center gap-4">
        {Icon && <Icon size={20} />}
        <span className="text-sm">{label}</span>
      </span>
    </NavLink>
  );
}
