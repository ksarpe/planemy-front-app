export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: "light" | "dark";
  language: string;
  timezone?: string;
  shareNotificationEnabled: boolean;
  defaultTaskListId?: string;
  colorThemeIndex?: number; // 0 Cozy, 1 Sweet, 2 Business, 3 Dark Mode
}

// UI: Profile / Appearance
export interface ColorTheme {
  name: string;
  description: string;
  colors: string[];
}

// Shared user info model for profile sections
export interface UserBasicInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  bio: string;
}

export interface ProfileHeaderProps {
  userInfo: Pick<UserBasicInfo, "firstName" | "lastName" | "email" | "bio">;
}

export interface PersonalInformationSectionProps {
  userInfo: UserBasicInfo;
  handleUserInfoChange: (field: keyof UserBasicInfo | string, value: string) => void;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  tasks: boolean;
  events: boolean;
  sharing: boolean;
}

export interface NotificationSettingsSectionProps {
  notifications: NotificationSettings;
  handleNotificationChange: (field: keyof NotificationSettings | string, value: boolean) => void;
}

export interface LanguageRegionSectionProps {
  language: string;
  setLanguage: (language: string) => void;
  timezone: string;
  setTimezone: (timezone: string) => void;
}

export interface AppearanceThemeSectionProps {
  isDark: boolean;
  toggleTheme: () => void;
  selectedTheme: number;
  setSelectedTheme: (index: number) => void;
}
