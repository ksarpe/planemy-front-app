import { useLogout } from "@shared/hooks/auth/useAuth";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { useToast } from "@shared/hooks/toasts/useToast";
import { FiLogOut, FiUser } from "react-icons/fi";

export interface SidebarUserSectionProps {
  collapsed: boolean;
  onSettingsClick: () => void;
}

export function SidebarUserSection({ collapsed, onSettingsClick }: SidebarUserSectionProps) {
  const { user } = useAuthContext();
  const logout = useLogout();
  const { showError } = useToast();

  const handleLogout = () => {
    try {
      logout.mutate();
    } catch (error) {
      console.error("Error during logout:", error);
      showError("Błąd podczas wylogowywania");
    }
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleLogout();
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          onClick={onSettingsClick}
          className="w-12 h-12 rounded-full  bg-bg-muted-light flex items-center justify-center font-bold text-text cursor-pointer"
          title={user?.username || user?.email || "Profil"}>
          <FiUser size={24} className="text-text-muted" />
        </div>
        <FiLogOut size={24} className="text-text-muted hover:text-red-400 cursor-pointer" onClick={handleLogoutClick} />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center  gap-3 justify-between p-2 rounded-2xl">
        <div
          onClick={onSettingsClick}
          className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-bg-muted-light flex items-center justify-center font-bold text-black">
            <FiUser size={24} className="text-text-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate ">{user!.username || user!.email || "Użytkownik"}</p>
            <p className="text-xs text-text truncate">{"Free plan"}</p>
          </div>
        </div>
        <FiLogOut size={24} className="text-text-muted hover:text-red-400 cursor-pointer" onClick={handleLogoutClick} />
      </div>
    </div>
  );
}
