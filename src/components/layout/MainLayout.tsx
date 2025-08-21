// MainLayout.tsx
import Sidebar from "@/components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import { useRef, useState } from "react";
import { Menu } from "lucide-react";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return; // only mobile
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    const start = touchStartRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = Math.abs(t.clientY - start.y);

    // Edge-swipe from the left to open
    if (!isSidebarOpen && start.x <= 20 && dx > 60 && dy < 40) {
      setIsSidebarOpen(true);
    }
    touchStartRef.current = null;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col bg-bg">
        {/* Top bar (mobile only) */}
        <div className="md:hidden flex items-center justify-between h-14 px-6 border-b border-bg-hover bg-bg-alt/90 backdrop-blur supports-[backdrop-filter]:bg-bg-alt/70 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Otwórz menu"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 border border-bg-hover bg-bg-alt hover:bg-bg-hover transition-colors">
              <Menu size={20} />
            </button>{" "}
            <img src="logo.png" alt="Logo" className="h-14 w-auto" />
          </div>
          {/* Placeholder for right side (future actions) */}
          <div className="flex items-center gap-3 text-xs text-slate-500"></div>
        </div>
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
