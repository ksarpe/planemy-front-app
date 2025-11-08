import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CheckSquare, Share2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../shadcn/button";

type NotificationType = "task" | "event" | "share";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  unread: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "task",
    title: "Shopping List Updated",
    description: "New item added: Organic Apples",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    unread: true,
  },
  {
    id: 2,
    type: "event",
    title: "Team Meeting Tomorrow",
    description: "Daily standup at 10:00 AM",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    unread: true,
  },
  // {
  //   id: 3,
  //   type: "share",
  //   title: "Task List Shared With You",
  //   description: "John shared 'Project Tasks' list",
  //   timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  //   unread: false,
  // },
  // {
  //   id: 4,
  //   type: "task",
  //   title: "Task Completed",
  //   description: "Review documentation marked as done",
  //   timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  //   unread: false,
  // },
  // {
  //   id: 5,
  //   type: "event",
  //   title: "Event Reminder",
  //   description: "Doctor's appointment in 2 days",
  //   timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  //   unread: false,
  // },
];

function NotificationIcon({ type }: { type: NotificationType }) {
  const iconClass = "w-5 h-5";

  switch (type) {
    case "task":
      return (
        <div className="rounded-2xl px-2">
          <CheckSquare className={`${iconClass} text-primary`} />
        </div>
      );
    case "event":
      return (
        <div className="rounded-2xl px-2">
          <Calendar className={`${iconClass} text-accent`} />
        </div>
      );
    case "share":
      return (
        <div className="rounded-2xl px-2">
          <Share2 className={`${iconClass} text-success`} />
        </div>
      );
  }
}

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true">
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

interface NotificationPopupProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function NotificationPopup({ children, open, onOpenChange }: NotificationPopupProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, unread: false } : notification)),
    );
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-bg-alt shadow-xl border border-bg-muted-light shadow-shadow"
        align="end"
        side="right"
        sideOffset={8}
        onMouseLeave={() => onOpenChange?.(false)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text">Notifications</h3>
            {unreadCount > 0 && <span className="text-xs font-bold text-primary">({unreadCount})</span>}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="link" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange?.(false)} aria-label="Close notifications">
              <X className="w-4 h-4 text-text-muted" />
            </Button>
          </div>
        </div>

        {/* Notification List */}
        <div className="">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-border last:border-b-0 transition-colors hover:bg-bg-hover cursor-pointer ${
                  notification.unread ? "bg-primary/5" : ""
                }`}
                onClick={() => handleNotificationClick(notification.id)}>
                <div className="flex items-start gap-3">
                  <NotificationIcon type={notification.type} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-text truncate">{notification.title}</h4>
                      {notification.unread && <Dot className="text-primary mt-1 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{notification.description}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {/* {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-border bg-bg-hover">
            <button className="w-full text-xs font-medium text-primary hover:underline">View all notifications</button>
          </div>
        )} */}
      </PopoverContent>
    </Popover>
  );
}
