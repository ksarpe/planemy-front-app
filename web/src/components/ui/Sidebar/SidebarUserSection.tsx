import { FiLogOut } from "react-icons/fi";
import type { SidebarUserSectionProps } from "@shared/data/Layout/Components/LayoutComponentInterfaces";

export function SidebarUserSection({ collapsed, user, handleNavigate, handleLogout }: SidebarUserSectionProps) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          onClick={handleNavigate}
          className="w-12 h-12 rounded-md bg-primary hover:bg-primary/60 flex items-center justify-center font-bold text-text cursor-pointer"
          title={user?.displayName || user?.email || "Profil"}>
          {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
        </div>
        <FiLogOut size={24} className="text-text-muted hover:text-red-400 cursor-pointer" onClick={handleLogout} />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center gap-3 justify-between p-2 rounded-md hover:bg-bg-hover transition-colors">
        <div onClick={handleNavigate} className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden group">
          <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center font-bold text-black">
            {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate ">
              {user?.displayName || user?.email || "Użytkownik"}
            </p>
            <p className="text-xs text-text truncate">{"Free plan"}</p>
          </div>
          <FiLogOut size={24} className="text-text-muted hover:text-red-400 cursor-pointer" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
