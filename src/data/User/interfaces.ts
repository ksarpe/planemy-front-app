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
  shareNotificationEnabled: boolean;
  defaultTaskListId?: string;
}