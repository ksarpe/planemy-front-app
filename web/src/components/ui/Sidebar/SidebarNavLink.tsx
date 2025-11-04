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
          `relative w-12 h-12 flex flex-col items-center justify-center rounded-2xl border border-bg-muted-light overflow-hidden group active:scale-95 transition-transform duration-200 ${
            isActive ? "bg-primary/10 border-primary" : ""
          }`
        }>
        {({ isActive }) => (
          <>
            {/* Background with icon that slides in from bottom */}
            <span
              className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 translate-y-full group-hover:translate-y-0 ease ${
                isActive ? "bg-primary text-white" : "bg-primary text-white"
              }`}>
              <Icon size={24} />
            </span>

            {/* Icon that slides out to top */}
            <span
              className={`absolute inset-0 flex items-center justify-center w-full h-full transition-all duration-300 transform group-hover:-translate-y-full ease ${
                isActive ? "text-primary" : "text-text-muted"
              }`}>
              <Icon size={24} />
            </span>

            {/* Invisible placeholder to maintain size */}
            <span className="relative invisible">
              <Icon size={24} />
            </span>
          </>
        )}
      </NavLink>
    );
  }
  // EXPANDED VERSION
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative p-2 rounded-2xl flex items-center justify-center active:scale-95 border transition-transform duration-200 border-bg-muted-light overflow-hidden text-sm group ${
          isActive ? "bg-primary/10 border-primary" : ""
        }`
      }>
      {({ isActive }) => (
        <>
          {/* Background with icon that slides in from bottom */}
          <span
            className={`absolute inset-0 flex items-center justify-center w-full h-full duration-300 translate-y-full group-hover:translate-y-0 ease ${
              isActive ? "bg-primary text-white" : "bg-primary text-white"
            }`}>
            <Icon size={24} />
          </span>

          {/* Text that slides out to top */}
          <span
            className={`absolute flex items-center justify-start pl-2 w-full h-full transition-all duration-300 transform group-hover:-translate-y-full ease gap-2 ${
              isActive ? "text-primary" : "text-text-muted"
            }`}>
            <Icon size={24} />
            <span className="text-sm">{label}</span>
          </span>

          {/* Invisible placeholder to maintain size */}
          <span className="relative invisible flex items-center gap-2">
            <Icon size={24} />
            <span className="text-sm">{label}</span>
          </span>
        </>
      )}
    </NavLink>
  );
}
