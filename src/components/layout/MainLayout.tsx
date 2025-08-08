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
      {/* Mobile toggle button (smaller and attached to left edge) */}
      {!isSidebarOpen && (
        <button
          type="button"
          aria-label="Otwórz menu"
          className="md:hidden fixed top-2 left-0 z-50 px-2 py-2 rounded-r-md bg-bg-alt/90 border border-l-0 border-bg-hover text-text shadow"
          onClick={() => setIsSidebarOpen(true)}>
          <Menu size={18} />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Content */}
      <main className="flex-1 bg-bg overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
