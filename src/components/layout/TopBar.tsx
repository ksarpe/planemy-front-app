import { Menu } from "lucide-react";

export default function TopBar({ setIsSidebarOpen }: { setIsSidebarOpen: (open: boolean) => void }) {
  return (
    <div className="md:hidden flex items-center justify-between h-14 px-6 bg-bg backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Otwórz menu"
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center justify-center rounded-md p-2 bg-text-muted/20 hover:bg-bg-alt cursor-pointer transition-colors">
          <Menu size={20} />
        </button>{" "}
        <img src="logo.png" alt="Logo" className="h-14 w-auto" />
      </div>
      {/* Placeholder for right side (future actions) */}
      <div></div>
    </div>
  );
}
