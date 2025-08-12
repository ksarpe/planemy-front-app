import { NavLink } from "react-router-dom";
import type { SidebarLinkProps } from "@/data/Main/interfaces";

export default function SidebarLink({ to, icon: Icon, label, onNavigate }: SidebarLinkProps) {
  // each navlink configuration, including default values + active/inactive styles
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `px-3 py-1 rounded-md ${isActive ? "bg-bg-hover  font-bold" : "hover:bg-bg-hover "}`
      }>
      <span className="inline-flex items-center gap-2">
        {Icon && <Icon size={18} />}
        <span className="text-sm">{label}</span>
      </span>
    </NavLink>
  );
}
