import NotificationPopup from "@/components/ui/Announcements/NotificationPopup";
import { Badge } from "@/components/ui/Common/Badge";
import { tutorialStepsMap } from "@/config/tutorialSteps";
import { useTutorial } from "@/context/TutorialContext";
import { useEffect, useState } from "react";
import { FiBell, FiBook, FiSettings } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { HelpPopover } from "./HelpPopover";

export default function SidebarSettings({
  collapsed,
  onSettingsClick,
}: {
  collapsed: boolean;
  onSettingsClick: () => void;
}) {
  const location = useLocation();
  const { setSteps, startTutorial } = useTutorial();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Mock unread count - replace with actual data later
  const unreadCount = 2;

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
        <NotificationPopup open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <div
            className="rounded-lg p-2 flex items-center justify-center w-full hover:bg-bg cursor-pointer relative"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            title="Notifications">
            <FiBell size={20} className="text-text-muted" />
            {unreadCount > 0 && (
              <Badge variant="primary" className="absolute -top-1 -right-1 min-w-4 h-4">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
        </NotificationPopup>
        <button
          onClick={onSettingsClick}
          className="rounded-lg p-2 flex items-center justify-center w-full hover:bg-bg"
          title="Settings">
          <FiSettings size={20} className="text-text-muted hover:text-text transition-colors" />
        </button>
        <button
          onClick={handleTutorialClick}
          className="rounded-lg p-2 flex items-center justify-center w-full hover:bg-bg"
          title="Start Tutorial">
          <FiBook size={20} className="text-text-muted hover:text-text transition-colors" />
        </button>
        <HelpPopover collapsed={true} />
      </div>
    );
  }

  return (
    <div className="flex gap-0.5 ml-2 justify-evenly">
      <NotificationPopup open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <div
          className="rounded-lg p-2 text-lg hover:bg-bg cursor-pointer relative"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          title="Notifications">
          <FiBell className="text-text-muted" />
          {unreadCount > 0 && (
            <Badge variant="primary" className="absolute -top-1 -right-1 min-w-4 h-4">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </div>
      </NotificationPopup>
      <button
        onClick={onSettingsClick}
        className="rounded-lg p-2 text-lg hover:bg-bg transition-colors"
        title="Settings">
        <FiSettings className="text-text-muted hover:text-text transition-colors" />
      </button>
      <button
        onClick={handleTutorialClick}
        className="rounded-lg p-2 text-lg hover:bg-bg transition-colors"
        title="Start Tutorial">
        <FiBook className="text-text-muted hover:text-text transition-colors" />
      </button>
      <HelpPopover collapsed={false} />
    </div>
  );
}
