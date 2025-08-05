// react
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//compontents
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// views
import MainLayout from "@/components/layout/MainLayout";
import CalendarView from "@/components/views/CalendarView";
import NotFoundView from "@/components/views/NotFoundView";
import ProfileView from "@/components/views/ProfileView";
import ShoppingView from "@/components/views/ShoppingView";
import TasksView from "@/components/views/TasksView";
import PaymentsView from "@/components/views/PaymentsView";
import LabelsView from "@/components/views/LabelsView";

// context
import Providers from "@/context/AllProviders";

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
  // <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  // </StrictMode>
);

