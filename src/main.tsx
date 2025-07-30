import { PreferencesProvider } from "@/context/PreferencesContext";
import { ToastProvider } from "@/context/ToastContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout.tsx";
import CalendarView from "@/components/views/CalendarView.tsx";
import NotFoundView from "@/components/views/NotFoundView.tsx";
import ProfileView from "@/components/views/ProfileView.tsx";
import ShoppingView from "@/components/views/ShoppingView.tsx";
import TasksView from "@/components/views/TasksView.tsx";
import PaymentsView from "@/components/views/PaymentsView.tsx";
import LabelsView from "@/components/views/LabelsView.tsx";

import { AuthProvider } from "./context/AuthContext";
import { ShoppingProvider } from "./context/ShoppingContext";
import { LabelProvider } from "./context/LabelContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CalendarView /> },
      { path: "/calendar", element: <CalendarView /> },
      { path: "/tasks", element: <TasksView /> },
      { path: "/profile", element: <ProfileView /> },
      { path: "/shopping", element: <ShoppingView /> },
      { path: "/payments", element: <PaymentsView /> },
      { path: "/labels", element: <LabelsView /> },
      { path: "*", element: <NotFoundView /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  //Remove STRICT MODE for production (possibly it does it itself)
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <PreferencesProvider>
          <LabelProvider>
            <ShoppingProvider>
              <RouterProvider router={router} />
            </ShoppingProvider>
          </LabelProvider>
        </PreferencesProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);
