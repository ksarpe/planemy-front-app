import NotificationPopup from "@/components/ui/Announcements/NotificationPopup";
import { Badge } from "@/components/ui/Common/Badge";
import { tutorialStepsMap } from "@/config/tutorialSteps";
import { useTutorial } from "@/context/TutorialContext";
import { useEffect, useState } from "react";
import { FiBell, FiBook, FiSettings } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { Button } from "../Utils/button";
import { HelpPopover } from "./HelpPopover";

export default function SidebarTools({
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
    const steps = tutorialStepsMap[location.pathname];
    if (steps) {
      setSteps(steps);
      startTutorial();
    } else {
      console.warn("Tutorial - No steps configured for", location.pathname);
    }
  };

  return (
    <div className={`flex ${collapsed && "flex-col"} items-center justify-between`}>
      <NotificationPopup open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
        <div
          className="rounded-2xl p-4 flex active:scale-95 hover:bg-bg-secondary text-text cursor-pointer relative"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          title="Notifications">
          <FiBell size={16} />
          {unreadCount > 0 && (
            <Badge variant="primary" className="absolute top-1 right-1 w-4 h-4">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </div>
      </NotificationPopup>
      <Button onClick={onSettingsClick} variant="ghost" title="Settings" className="p-4">
        <FiSettings size={16} />
      </Button>
      <Button onClick={handleTutorialClick} variant="ghost" title="Start Tutorial" className="p-4">
        <FiBook size={16} />
      </Button>
      <HelpPopover collapsed={collapsed} />
    </div>
  );
}
