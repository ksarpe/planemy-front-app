import { NavLink } from 'react-router-dom';

type Props = {
  to: string;
  icon: string;
  label: string;
};

export default function SidebarLink({ to, icon, label }: Props) {
  // each navlink configuration, including default values + active/inactive styles
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1 rounded-md ${
          isActive
            ? 'bg-bg-hover dark:bg-bg-hover-dark font-bold'
            : 'hover:bg-bg-hover dark:hover:bg-bg-hover-dark'
        }`
      }
    >
      <span className="inline-flex gap-2">
        <span>{icon}</span>
        <span>{label}</span>
      </span>
    </NavLink>
  );
}
