import { useAuthContext } from "@/hooks/context/useAuthContext";
import { useToastContext } from "@/hooks/context/useToastContext";
import { usePendingShares } from "@/hooks/permissions/usePermissions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { SidebarNav } from "../ui/Sidebar/SidebarNav";
import { SidebarUserSection } from "../ui/Sidebar/SidebarUserSection";

// Sidebar with collapsible (icon-only) desktop mode. When collapsed:
// - Width shrinks to 72px
// - Logo hidden, only nav icons shown centered
// - Bottom user section replaced by a circular avatar (click opens profile) + logout icon inside tooltip area
// - Expand/collapse toggle is a vertical strip hoverable or a button overlay
export default function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const { user, logout } = useAuthContext();
  const { showToast } = useToastContext();

  // counts (lightweight; consider optimization later)
  const { data: taskListShares = [] } = usePendingShares("task_list");
  const { data: shoppingListShares = [] } = usePendingShares("shopping_list");
  const totalNotifications = taskListShares.length + shoppingListShares.length;

  const handleLogout = async () => {
    try {
      await logout();
      showToast("success", "Pomyślnie wylogowano!");
      onClose?.();
    } catch (e) {
      showToast("error", e instanceof Error ? e.message : "Błąd podczas wylogowywania");
    }
  };
  const handleNavigate = () => onClose?.();

  // touch swipe (mobile)
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
    if (dx < -60 && dy < 40) onClose?.();
    startRef.current = null;
  };

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("app_sidebar_collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("app_sidebar_collapsed", collapsed ? "true" : "false");
  }, [collapsed]);
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) setCollapsed(false);
  }, [isOpen]);

  const widthClasses = collapsed ? "w-[72px] min-w-[72px]" : "w-58 min-w-58";
  const linkPadding = collapsed ? "px-3 justify-center" : "px-5";
  const labelHidden = collapsed ? "opacity-0 pointer-events-none select-none w-0 overflow-hidden" : "opacity-100";
  const iconSize = 24;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 md:hidden z-40" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${widthClasses} h-full transform transition-all duration-300 bg-bg-alt text-text border-r border-bg-hover md:static md:translate-x-0 md:flex flex flex-col justify-between p-2${
          isOpen ? " translate-x-0" : " -translate-x-full md:translate-x-0"
        }`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        {/* collapse toggle (desktop) */}
        <button
          type="button"
          aria-label={collapsed ? "Rozwiń sidebar" : "Zwiń sidebar"}
          className="hidden md:flex absolute -right-3 top-8 h-8 w-6 items-center justify-center rounded-md border border-bg-hover bg-bg-alt shadow-sm hover:bg-bg-hover transition-colors"
          onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* top section */}
        <div className="flex flex-col gap-1 flex-1 overflow-hidden">
          <NavLink
            to="/"
            className={`flex items-center justify-center mb-2 transition-all duration-300 ${
              collapsed ? "h-16" : "h-28"
            }`}
            onClick={handleNavigate}>
            <img
              src={collapsed ? "minilogo.png" : "logo.png"}
              alt="Planora logo"
              className={` ${collapsed ? "h-10 w-10" : "h-20 w-45"}`}
            />
          </NavLink>
          <SidebarNav
            handleNavigate={handleNavigate}
            linkPadding={linkPadding}
            labelHiddenClass={labelHidden}
            iconSize={iconSize}
            totalNotifications={totalNotifications}
            collapsed={collapsed}
          />
        </div>

        {/* bottom user section extracted */}
        <div className="mt-2 pt-3">
          <SidebarUserSection
            collapsed={collapsed}
            user={user}
            handleNavigate={handleNavigate}
            handleLogout={handleLogout}
          />
        </div>
      </aside>
    </>
  );
}
