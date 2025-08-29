// react
//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// i18n setup
import "./i18n";

//compontents
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// views
import MainLayout from "@/components/layout/MainLayout";
import CalendarView from "@/components/views/CalendarView";
import DashboardView from "@/components/views/DashboardView";
import NotFoundView from "@/components/views/NotFoundView";
import ProfileView from "@/components/views/ProfileView";
import ShoppingView from "@/components/views/ShoppingView";
import TasksView from "@/components/views/TasksView";
import PaymentsView from "@/components/views/PaymentsView";
import LabelsView from "@/components/views/LabelsView";
import NotificationsView from "@/components/views/NotificationsView";
import FeedbackView from "@/components/views/FeedbackView";

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
      { index: true, element: <DashboardView /> },
      { path: "/dashboard", element: <DashboardView /> },
      { path: "/calendar", element: <CalendarView /> },
      { path: "/tasks", element: <TasksView /> },
      { path: "/profile", element: <ProfileView /> },
      { path: "/shopping", element: <ShoppingView /> },
      { path: "/payments", element: <PaymentsView /> },
      { path: "/labels", element: <LabelsView /> },
      { path: "/notifications", element: <NotificationsView /> },
      { path: "/feedback", element: <FeedbackView /> },
      { path: "*", element: <NotFoundView /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Providers>
    <RouterProvider router={router} />
  </Providers>,
  // </StrictMode>
);
