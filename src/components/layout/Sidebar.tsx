import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import { usePendingShares } from "@/hooks/permissions/usePermissions";
import { Moon, Sun, LogOut, Tag, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import SidebarLink from "../ui/Sidebar/SidebarLink";

export default function Sidebar() {
  const { isDark, toggleTheme } = usePreferencesContext();
  const { user, logout } = useAuthContext();
  const { showToast } = useToastContext();

  // Get notification counts
  // TODO: only for counting purpuse. Change for more efficient solutioin
  const { data: taskListShares = [] } = usePendingShares("task_list");
  const { data: shoppingListShares = [] } = usePendingShares("shopping_list");
  const totalNotifications = taskListShares.length + shoppingListShares.length;

  const handleLogout = async () => {
    try {
      await logout();
      showToast("success", "Pomyślnie wylogowano!");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Błąd podczas wylogowywania");
    }
  };

  return (
    // whole sidebar with logo,links and bottom content
    <aside className="w-64 min-w-64 h-full flex transition-all duration-600 flex-col justify-between p-4 bg-bg-alt dark:bg-bg-alt-dark text-text dark:text-text-dark border-r border-bg-hover dark:border-bg-hover-dark">
      {/* logo + links */}
      <div className="flex flex-col gap-1 justify-between">
        <NavLink to="/" className={"flex justify-center"}>
          <img
            src="logo.png" // albo .png – ścieżkę dopasuj do siebie
            alt="Planora logo"
            className="h-20 w-45 mb-4"
          />
        </NavLink>
        <SidebarLink to="/dashboard" icon="📊" label="Panel" />
        <SidebarLink to="/calendar" icon="📅" label="Kalendarz" />
        <SidebarLink to="/tasks" icon="📋" label="Zadania" />
        <SidebarLink to="/shopping" icon="🛒" label="Zakupy" />
        <SidebarLink to="/payments" icon="🪙" label="Płatności" />
      </div>
      {/* logo + links END*/}
      {/* botton content */}
      <div className="flex flex-col gap-2">
        {/* Theme toggle and logout */}
        <div className="flex flex-col justify-between px-2 gap-2">
          <NavLink to="/labels" className="flex items-center gap-2 text-text dark:text-text-dark">
            <Tag size={20} />
            <span className="text-sm hover:text-primary hover:dark:text-primary-dark hover:cursor-pointer">
              Etykiety
            </span>
          </NavLink>

          <button onClick={toggleTheme} className="flex items-center gap-2 text-text dark:text-text-dark ">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm hover:text-primary hover:dark:text-primary-dark hover:cursor-pointer">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
          <NavLink
            to="/notifications"
            className="flex items-center gap-2 text-text dark:text-text-dark hover:dark:text-bg-hover-dark relative">
            <Bell size={20} />
            <span className="text-sm hover:text-primary hover:dark:text-primary-dark hover:cursor-pointer">
              Powiadomienia
            </span>
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalNotifications > 9 ? "9+" : totalNotifications}
              </span>
            )}
          </NavLink>
        </div>
        {/* User info */}
        {/* Panel użytkownika */}
        <div className="border-t border-slate-300 dark:border-slate-800 pt-4 flex items-center gap-3">
          {/* User Profile Link */}
          <NavLink
            to="/profile"
            className="flex items-center gap-3 flex-1 p-2 rounded-md hover:bg-bg-hover dark:hover:bg-bg-hover-dark transition-colors group">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
              {user?.displayName?.charAt(0) || "U"}
            </div>

            {/* Informacje o użytkowniku */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                {user?.displayName || "Użytkownik"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </NavLink>

          {/* Przycisk wylogowania */}
          <button
            onClick={handleLogout}
            title="Wyloguj się"
            className="p-2 rounded-md cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors duration-200">
            <LogOut size={20} />
          </button>
        </div>
      </div>
      {/* bottom content END */}
    </aside>
  );
}
