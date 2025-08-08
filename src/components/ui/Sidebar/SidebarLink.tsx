import { NavLink } from "react-router-dom";

type Props = {
  to: string;
  icon: string;
  label: string;
  onNavigate?: () => void;
};

export default function SidebarLink({ to, icon, label, onNavigate }: Props) {
  // each navlink configuration, including default values + active/inactive styles
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `px-3 py-1 rounded-md ${isActive ? "bg-bg-hover  font-bold" : "hover:bg-bg-hover "}`
      }>
      <span className="inline-flex gap-2">
        <span>{icon}</span>
        <span>{label}</span>
      </span>
    </NavLink>
  );
}
