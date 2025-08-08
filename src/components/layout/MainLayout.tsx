// MainLayout.tsx
import Sidebar from "@/components/layout/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen">
      {/* Task provider has to be her because Sidebar uses it to hide */}
      <Sidebar />
      <main className="flex-1 bg-bg ">
        <Outlet />
      </main>
    </div>
  );
}
