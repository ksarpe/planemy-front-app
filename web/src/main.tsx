// react
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@shared/i18n";

// views
import MainLayout from "@/components/layout/MainLayout"; //no lazy load coz it is used everywhere
import Spinner from "./components/ui/Utils/Spinner";

const CalendarView = lazy(() => import("@/components/views/CalendarView"));
const DashboardView = lazy(() => import("@/components/views/DashboardView"));
const NotFoundView = lazy(() => import("@/components/views/NotFoundView"));
const ProfileView = lazy(() => import("@/components/views/ProfileView"));
const ShoppingView = lazy(() => import("@/components/views/ShoppingView"));
const TasksView = lazy(() => import("@/components/views/TasksView"));
const PaymentsView = lazy(() => import("@/components/views/PaymentsView"));
const LabelsView = lazy(() => import("@/components/views/LabelsView"));
const NotificationsView = lazy(() => import("@/components/views/NotificationsView"));
const FeedbackView = lazy(() => import("@/components/views/FeedbackView"));
const DevelopmentView = lazy(() => import("@/components/views/DevelopmentView"));

// providers/route // no lazy load as it is important to have fast
import Providers from "@shared/context/AllProviders";
import { WebToastProvider } from "./context/WebToastProvider";
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
      { index: true, element: <DashboardView /> },
      { path: "/calendar", element: <CalendarView /> },
      { path: "/tasks", element: <TasksView /> },
      { path: "/profile", element: <ProfileView /> },
      { path: "/shopping", element: <ShoppingView /> },
      { path: "/payments", element: <PaymentsView /> },
      { path: "/development", element: <DevelopmentView /> },
      { path: "/labels", element: <LabelsView /> },
      { path: "/notifications", element: <NotificationsView /> },
      { path: "/feedback", element: <FeedbackView /> },
      { path: "*", element: <NotFoundView /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Providers>
    <WebToastProvider>
      {/* Top level suspense to handle all lazy loaded components */}
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </WebToastProvider>
  </Providers>,
);
