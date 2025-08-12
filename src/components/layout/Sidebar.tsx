import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import { usePendingShares } from "@/hooks/permissions/usePermissions";
import { LogOut, Tag, Bell, LayoutDashboard, Calendar, ListTodo, ShoppingCart, Coins } from "lucide-react";
import { NavLink } from "react-router-dom";
import SidebarLink from "../ui/Sidebar/SidebarLink";
import { useRef } from "react";

// Add props to control mobile open/close state
export default function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
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
      onClose?.();
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Błąd podczas wylogowywania");
    }
  };

  const handleNavigate = () => onClose?.();

  // Swipe-to-close on the sidebar surface
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    const s = startRef.current;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = Math.abs(t.clientY - s.y);
    // swipe left to close
    if (dx < -60 && dy < 40) onClose?.();
    startRef.current = null;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/40 md:hidden z-40" onClick={onClose} aria-hidden="true" />}

      {/* whole sidebar with logo,links and bottom content */}
      <aside
        className={
          `fixed inset-y-0 left-0 z-50 w-58 min-w-58 h-full transform transition-transform duration-300 
           bg-bg-alt text-text border-r border-bg-hover md:static md:translate-x-0 md:flex
           flex flex-col justify-between p-2 ` + (isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")
        }
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        {/* logo + links */}
        <div className="flex flex-col gap-1 justify-between">
          <NavLink to="/" className={"flex justify-center"} onClick={handleNavigate}>
            <img
              src="logo.png" // albo .png – ścieżkę dopasuj do siebie
              alt="Planora logo"
              className="h-20 w-45 mb-2"
            />
          </NavLink>
          <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Panel" onNavigate={handleNavigate} />
          <SidebarLink to="/calendar" icon={Calendar} label="Kalendarz" onNavigate={handleNavigate} />
          <SidebarLink to="/tasks" icon={ListTodo} label="Zadania" onNavigate={handleNavigate} />
          <SidebarLink to="/shopping" icon={ShoppingCart} label="Zakupy" onNavigate={handleNavigate} />
          <SidebarLink to="/payments" icon={Coins} label="Płatności" onNavigate={handleNavigate} />
        </div>
        {/* logo + links END*/}
        {/* botton content */}
        <div className="flex flex-col gap-2">
          {/* Theme toggle and logout */}
          <div className="flex flex-col justify-between px-2 gap-2">
            <NavLink
              to="/labels"
              className="flex items-center gap-2 text-text hover:text-primary hover:cursor-pointer"
              onClick={handleNavigate}>
              <Tag size={20} />
              <span className="text-sm">Etykiety</span>
            </NavLink>

            <NavLink
              to="/notifications"
              className="relative flex items-center gap-2 text-text hover:text-primary hover:cursor-pointer"
              onClick={handleNavigate}>
              <Bell size={20} />
              <span className="text-sm">Powiadomienia</span>
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalNotifications > 9 ? "9+" : totalNotifications}
                </span>
              )}
            </NavLink>
          </div>
          {/* User info */}
          {/* Panel użytkownika */}
          <div className="border-t border-slate-300 pt-4 flex items-center gap-3 justify-between">
            {/* User Profile Link */}
            <NavLink
              to="/profile"
              onClick={handleNavigate}
              className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden p-2 rounded-md hover:bg-bg-hover transition-colors group">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
              </div>

              {/* Stable-width username to avoid flicker on theme change */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-0">
                  {user?.displayName || user?.email || "Użytkownik"}
                </p>
                <p className="text-xs text-slate-500  truncate">{user?.email}</p>
              </div>
            </NavLink>

            {/* Przycisk wylogowania */}
            <button
              onClick={handleLogout}
              title="Wyloguj się"
              className="shrink-0 p-2 rounded-md cursor-pointer text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors duration-200">
              <LogOut size={20} />
            </button>
          </div>
        </div>
        {/* bottom content END */}
      </aside>
    </>
  );
}
