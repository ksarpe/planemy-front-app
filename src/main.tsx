import { PreferencesProvider } from "@/context/PreferencesContext";
import { ToastProvider } from "@/context/ToastContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

//DEV
import { AuthProvider } from "./context/AuthContext";
import { ShoppingProvider } from "./context/ShoppingContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
//DEV

const queryClient = new QueryClient();

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
      { path: "*", element: <NotFoundView /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  //Remove STRICT MODE for production to get rid of double logging
  <StrictMode>
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <PreferencesProvider>
          <ShoppingProvider>
            <RouterProvider router={router} />
          </ShoppingProvider>
        </PreferencesProvider>
      </ToastProvider>
    </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
