import { useLogout } from "@shared/hooks/auth/useAuth";
import { useAuthContext } from "@shared/hooks/context/useAuthContext";
import { useToast } from "@shared/hooks/toasts/useToast";
import { FiLogOut } from "react-icons/fi";

export interface SidebarUserSectionProps {
  collapsed: boolean;
  onSettingsClick: () => void;
}

export function SidebarUserSection({ collapsed, onSettingsClick }: SidebarUserSectionProps) {
  const { user } = useAuthContext();
  const logout = useLogout();
  const { showSuccess, showError } = useToast();

  const handleLogout = () => {
    try {
      logout.mutate();
      showSuccess("Pomyślnie wylogowano");
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
          className="w-12 h-12 rounded-2xl bg-primary hover:bg-primary/60 flex items-center justify-center font-bold text-text cursor-pointer"
          title={user?.username || user?.email || "Profil"}>
          {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
        </div>
        <FiLogOut size={24} className="text-text-muted hover:text-red-400 cursor-pointer" onClick={handleLogoutClick} />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center gap-3 justify-between p-2 rounded-2xl hover:bg-bg-hover transition-colors">
        <div
          onClick={onSettingsClick}
          className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-black">
            {(user!.username || user!.email || "U").charAt(0).toUpperCase()}
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
