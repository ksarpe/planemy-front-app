import { usePreferencesContext } from "@/context/PreferencesContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToastContext";
import { Moon, Sun, LogOut, User, Tag } from "lucide-react";
import { NavLink } from "react-router-dom";
import SidebarLink from "../ui/Sidebar/SidebarLink";

export default function Sidebar() {
  const { isDark, toggleTheme, isSidebarClosed } = usePreferencesContext();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast("success", "Pomyślnie wylogowano!");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Błąd podczas wylogowywania");
    }
  };

  if (isSidebarClosed) {
    return null; // or return a placeholder if needed
  }

  return (
    // whole sidebar with logo,links and bottom content
    <aside className="w-64 min-w-64 h-full flex transition-all duration-600 flex-col justify-between p-4 bg-bg-alt dark:bg-bg-dark text-text dark:text-text-dark border-r border-bg-hover dark:border-bg-hover-dark">
      {/* logo + links */}
      <div className="flex flex-col gap-1 justify-between">
        <NavLink to="/">
          <img
            src="logo.png" // albo .png – ścieżkę dopasuj do siebie
            alt="Planora logo"
            className="h-20 w-45 mb-4 text-center"
          />
        </NavLink>
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
            <NavLink
            to="/labels"
            className="flex items-center gap-2 text-text dark:text-text-dark hover:dark:text-bg-hover-dark">
            <Tag size={20} />
            <span className="text-sm hover:text-purple-500 hover:cursor-pointer">Etykiety</span>
            </NavLink>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-text dark:text-text-dark ">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm hover:text-primary hover:dark:text-bg-hover-dark hover:cursor-pointer">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
        {/* User info */}
        <div className="flex items-center gap-2 p-2 bg-bg-hover dark:bg-bg-hover-dark rounded-md">
          <User size={20} className="text-black" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text dark:text-text-dark truncate">
              {user?.displayName || user?.email || "Użytkownik"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-text dark:text-text-dark hover:text-red-500 hover:cursor-pointer"
            title="Wyloguj się">
            <LogOut size={20} />
          </button>
        </div>
      </div>
      {/* bottom content END */}
    </aside>
  );
}
