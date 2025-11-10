import type { SidebarLinkProps } from "@shared/data/Layout";
import { NavLink } from "react-router-dom";

export default function SidebarLink({ to, icon: Icon, label, onNavigate }: SidebarLinkProps) {
  // each navlink configuration, including default values + active/inactive styles
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `px-4 py-1.5 rounded-2xl ${isActive ? "bg-bg-secondary  font-bold" : "hover:bg-bg-secondary "}`
      }>
      <span className="flex items-center gap-4">
        {Icon && <Icon size={20} />}
        <span className="text-sm">{label}</span>
      </span>
    </NavLink>
  );
}
