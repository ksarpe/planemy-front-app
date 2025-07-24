// MainLayout.tsx
import Sidebar from "@/components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import { CalendarProvider } from "@/context/CalendarContext";
import { ShoppingProvider } from "@/context/ShoppingContext";
import { TaskProvider } from "@/context/TaskContext";
import { PaymentsProvider } from "@/context/PaymentsContext";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen">
      {/* Task provider has to be her because Sidebar uses it to hide */}
      <TaskProvider>
        <Sidebar />
        <main className="flex-1 bg-bg dark:bg-bg-alt-dark">
          <ShoppingProvider>
            <PaymentsProvider>
              <CalendarProvider>
                <Outlet />
              </CalendarProvider>
            </PaymentsProvider>
          </ShoppingProvider>
        </main>
      </TaskProvider>
    </div>
  );
}
