// MainLayout.tsx
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import TopBar from "./TopBar";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      {/* TODO maybe in future put it to some context to prevent prop drilling */}
      <Toaster position="bottom-center" richColors />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col bg-bg-primary">
        {/* TopBar with function to toggle sidebar because it is hidden by default */}
        <TopBar setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
