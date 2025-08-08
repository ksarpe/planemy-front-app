import { usePreferencesContext } from "@/hooks/context/usePreferencesContext";
import { useState } from "react";
import { User, Save } from "lucide-react";
import {
  ProfileHeader,
  PersonalInformationSection,
  AppearanceThemeSection,
  NotificationSettingsSection,
  LanguageRegionSection,
  SecuritySection,
} from "@/components/ui/User";

export default function ProfileView() {
  const { isDark, toggleTheme, colorTheme, setColorTheme, language, setLanguage, timezone, setTimezone } =
    usePreferencesContext();

  // User information
  const [userInfo, setUserInfo] = useState({
    firstName: "Kasper",
    lastName: "Janowski",
    email: "2299kasper@gmail.com",
    phone: "+48 123 456 789",
    location: "Kraków, Polska",
    dateOfBirth: "1995-03-15",
    bio: "Miłośnik organizacji i produktywności. Zawsze szukam lepszych sposobów na zarządzanie czasem.",
  });

  // Preferences
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    tasks: true,
    events: false,
    sharing: true,
  });

  const handleUserInfoChange = (field: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-full bg-bg-alt dark:bg-bg-dark rounded-md shadow-md overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Profil użytkownika</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Zarządzaj swoimi danymi i preferencjami</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Profile Picture & Basic Info */}
            <ProfileHeader userInfo={userInfo} />

            {/* Personal Information */}
            <PersonalInformationSection userInfo={userInfo} handleUserInfoChange={handleUserInfoChange} />

            {/* Appearance & Theme */}
            <AppearanceThemeSection
              isDark={isDark}
              toggleTheme={toggleTheme}
              selectedTheme={colorTheme}
              setSelectedTheme={setColorTheme}
            />

            {/* Notifications */}
            <NotificationSettingsSection
              notifications={notifications}
              handleNotificationChange={handleNotificationChange}
            />

            {/* Language & Region */}
            <LanguageRegionSection language={language} setLanguage={setLanguage} timezone={timezone} setTimezone={setTimezone} />

            {/* Security */}
            <SecuritySection />

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                <Save size={18} />
                Zapisz zmiany
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
