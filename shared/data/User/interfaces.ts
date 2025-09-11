export interface User {
  sub: string; // user id
  updatedAt: string; // ISO date string
  email: string;
  username: string;
  scopes: string[];
  is_onboarded: boolean;
}
export interface UserSettings {
  id: string;
  userId: string;
  theme: "light" | "dark";
  language: string;
  timezone?: string;
  shareNotificationEnabled: boolean;
  defaultTaskListId?: string;
  defaultShoppingListId?: string; // new: default shopping list
  colorThemeIndex?: number; // 0 Cozy, 1 Sweet, 2 Business, 3 Dark Mode
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  tasks: boolean;
  events: boolean;
  sharing: boolean;
}

// Onboarding interfaces
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepBaseProps>;
  isRequired: boolean;
}

export interface OnboardingStepProps {
  onNext: () => void;
  onPrev: () => void;
  onSkip?: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentStep: number;
  totalSteps: number;
  onboardingData?: OnboardingData;
  updateOnboardingData?: (updates: Partial<OnboardingData>) => void;
  isLoading?: boolean;
}

// Simplified step props without navigation (for centralized navigation)
export interface OnboardingStepBaseProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (updates: Partial<OnboardingData>) => void;
}

export interface OnboardingData {
  nickname?: string;
  language?: string;
  theme?: "light" | "dark";
  timezone?: string;
  notifications?: Partial<NotificationSettings>;
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
  selectedTheme: number;
  setSelectedTheme: (index: number) => void;
}

// Feedback related interfaces (moved from src/api/feedback.ts)
export interface Feedback {
  id: string;
  message: string;
  userId: string;
  createdAt: Date;
  status?: "pending" | "read" | "accepted" | "resolved";
  priority?: "low" | "medium" | "high";
}

export interface CreateFeedbackData {
  message: string;
}

