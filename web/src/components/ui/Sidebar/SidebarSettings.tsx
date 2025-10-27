import { tutorialStepsMap } from "@/config/tutorialSteps";
import { useTutorial } from "@/context/TutorialContext";
import { useEffect } from "react";
import { FiBell, FiBook, FiHelpCircle, FiSettings } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";

export default function SidebarSettings({ collapsed }: { collapsed: boolean }) {
  const location = useLocation();
  const { setSteps, startTutorial } = useTutorial();

  useEffect(() => {
    // Update tutorial steps when route changes
    const steps = tutorialStepsMap[location.pathname];
    if (steps) {
      setSteps(steps);
    }
  }, [location.pathname, setSteps]);

  const handleTutorialClick = () => {
    console.log("Tutorial - Book clicked, current path:", location.pathname);
    const steps = tutorialStepsMap[location.pathname];
    console.log("Tutorial - Steps found:", steps);
    if (steps) {
      setSteps(steps);
      startTutorial();
    } else {
      console.warn("Tutorial - No steps configured for", location.pathname);
    }
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 w-full">
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `rounded-lg p-2 flex items-center justify-center w-full ${isActive ? "bg-bg" : "hover:bg-bg"}`
          }>
          {({ isActive }) => <FiBell size={20} className={isActive ? "text-text" : "text-text-muted"} />}
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `rounded-lg p-2 flex items-center justify-center w-full ${isActive ? "bg-bg" : "hover:bg-bg"}`
          }>
          {({ isActive }) => <FiSettings size={20} className={isActive ? "text-text" : "text-text-muted"} />}
        </NavLink>
        <button
          onClick={handleTutorialClick}
          className="rounded-lg p-2 flex items-center justify-center w-full hover:bg-bg"
          title="Start Tutorial">
          <FiBook size={20} className="text-text-muted hover:text-text transition-colors" />
        </button>
        <NavLink
          to="/help"
          className={({ isActive }) =>
            `rounded-lg p-2 flex items-center justify-center w-full ${isActive ? "bg-bg" : "hover:bg-bg"}`
          }>
          {({ isActive }) => <FiHelpCircle size={20} className={isActive ? "text-text" : "text-text-muted"} />}
        </NavLink>
      </div>
    );
  }

  return (
    <div className="flex gap-0.5 ml-2 justify-evenly">
      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          `rounded-lg p-2
              text-lg ${isActive ? "bg-bg" : "hover:bg-bg"}`
        }>
        {({ isActive }) => (
          <>
            <FiBell className={isActive ? "text-text" : "text-text-muted"} />
          </>
        )}
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `rounded-lg p-2
              text-lg ${isActive ? "bg-bg" : "hover:bg-bg"}`
        }>
        {({ isActive }) => (
          <>
            <FiSettings className={isActive ? "text-text" : "text-text-muted"} />
          </>
        )}
      </NavLink>
      <button
        onClick={handleTutorialClick}
        className="rounded-lg p-2 text-lg hover:bg-bg transition-colors"
        title="Start Tutorial">
        <FiBook className="text-text-muted hover:text-text transition-colors" />
      </button>
      <NavLink
        to="/help"
        className={({ isActive }) =>
          `rounded-lg p-2
              text-lg ${isActive ? "bg-bg" : "hover:bg-bg"}`
        }>
        {({ isActive }) => (
          <>
            <FiHelpCircle className={isActive ? "text-text" : "text-text-muted"} />
          </>
        )}
      </NavLink>
    </div>
  );
}
