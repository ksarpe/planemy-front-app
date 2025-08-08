import { Bell } from "lucide-react";

interface NotificationSettingsSectionProps {
  notifications: {
    email: boolean;
    push: boolean;
    tasks: boolean;
    events: boolean;
    sharing: boolean;
  };
  handleNotificationChange: (field: string, value: boolean) => void;
}

export default function NotificationSettingsSection({
  notifications,
  handleNotificationChange,
}: NotificationSettingsSectionProps) {
  const notificationSettings = [
    { key: "email", label: "Powiadomienia email", description: "Otrzymuj powiadomienia na email" },
    { key: "push", label: "Powiadomienia push", description: "Powiadomienia w przeglądarce" },
    { key: "tasks", label: "Przypomnienia o zadaniach", description: "Powiadomienia o terminach zadań" },
    { key: "events", label: "Powiadomienia o eventach", description: "Przypomnienia o nadchodzących eventach" },
    { key: "sharing", label: "Powiadomienia o udostępnianiu", description: "Informacje o udostępnionych listach" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Bell size={20} className="text-primary" />
        Powiadomienia
      </h3>
      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{setting.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
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
