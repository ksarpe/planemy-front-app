import { Bell } from "lucide-react";
import type { NotificationSettingsSectionProps } from "@/data/User";
import { useT } from "@/hooks/useT";

export default function NotificationSettingsSection({
  notifications,
  handleNotificationChange,
}: NotificationSettingsSectionProps) {
  const { t } = useT();

  const notificationSettings = [
    { key: "email", label: t("notifications.email.title"), description: t("notifications.email.description") },
    { key: "push", label: t("notifications.push.title"), description: t("notifications.push.description") },
    {
      key: "tasks",
      label: t("notifications.taskReminders.title"),
      description: t("notifications.taskReminders.description"),
    },
    {
      key: "events",
      label: t("notifications.eventNotifications.title"),
      description: t("notifications.eventNotifications.description"),
    },
    {
      key: "sharing",
      label: t("notifications.sharingNotifications.title"),
      description: t("notifications.sharingNotifications.description"),
    },
  ];

  return (
    <div className="bg-white  rounded-lg p-6 border border-gray-200 ">
      <h3 className="text-lg font-semibold text-gray-900  mb-6 flex items-center gap-2">
        <Bell size={20} className="text-primary" />
        {t("notifications.title")}
      </h3>
      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 ">{setting.label}</p>
              <p className="text-sm text-gray-500 ">{setting.description}</p>
            </div>
            <button
              onClick={() =>
                handleNotificationChange(setting.key, !notifications[setting.key as keyof typeof notifications])
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications[setting.key as keyof typeof notifications] ? "bg-primary" : "bg-gray-200"
              }`}>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications[setting.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
