// react
import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@shared/i18n"; //Check if needed

// views
import MainLayout from "@/components/layout/MainLayout"; //no lazy load coz it is used everywhere
import Spinner from "./components/ui/Loaders/Spinner";

const BuddyView = lazy(() => import("@/components/views/BuddyView"));
const CalendarView = lazy(() => import("@/components/views/CalendarView"));
const DashboardView = lazy(() => import("@/components/views/DashboardView"));
const NotFoundView = lazy(() => import("@/components/views/NotFoundView"));
const TasksView = lazy(() => import("@/components/views/TasksView"));
const PaymentsView = lazy(() => import("@/components/views/PaymentsView"));
const LabelsView = lazy(() => import("@/components/views/LabelsView"));
const DevelopmentView = lazy(() => import("@/components/views/DevelopmentView"));

// providers/route // no lazy load as it is important to have fast
import Providers from "@shared/context/AllProviders";
import { ProtectedRoute } from "./components/ui/Signing/ProtectedRoute";
import { TutorialOverlay } from "./components/ui/Tutorial/TutorialOverlay";
import { TutorialProvider } from "./context/TutorialContext";
import { WebToastProvider } from "./context/WebToastProvider";

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
      { path: "/buddy", element: <BuddyView /> },
      { path: "/calendar", element: <CalendarView /> },
      { path: "/tasks", element: <TasksView /> },
      { path: "/payments", element: <PaymentsView /> },
      { path: "/development", element: <DevelopmentView /> },
      { path: "/labels", element: <LabelsView /> },
      { path: "*", element: <NotFoundView /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<Spinner />}>
    {/* Top level suspense to handle all lazy loaded components */}
    <Providers>
      <WebToastProvider>
        <TutorialProvider>
          <RouterProvider router={router} />
          <TutorialOverlay />
        </TutorialProvider>
      </WebToastProvider>
    </Providers>
  </Suspense>,
);
