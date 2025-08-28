import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import type { SidebarUserSectionProps } from "@/data/Utils/UI/ComponentInterfaces";

export function SidebarUserSection({ collapsed, user, handleNavigate, handleLogout }: SidebarUserSectionProps) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 pb-2">
        <NavLink
          to="/profile"
          onClick={handleNavigate}
          className="w-12 h-12 rounded-md bg-primary flex items-center justify-center font-bold text-white hover:ring-2 hover:ring-primary/60 transition-all"
          title={user?.displayName || user?.email || "Profil"}>
          {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
        </NavLink>

        <button
          onClick={handleLogout}
          title="Wyloguj się"
          className="w-12 h-12 flex items-center justify-center rounded-md bg-bg-hover hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 justify-between p-2 rounded-md hover:bg-bg-hover transition-colors">
        <NavLink
          to="/profile"
          onClick={handleNavigate}
          className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden group">
          <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center font-bold text-white">
            {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate group-hover:text-primary">
              {user?.displayName || user?.email || "Użytkownik"}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          title="Wyloguj się"
          className="shrink-0 p-2 rounded-md cursor-pointer text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors">
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
}
