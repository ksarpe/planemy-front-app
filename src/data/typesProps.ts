import type { EventInterface, CalendarClickContent, PaymentInterface } from "./types";
// Shopping types and ShoppingContextProps moved to '@/data/Shopping/interfaces'
import { UserSettings } from "./User/interfaces";

export interface ToastContextProps {
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}

export interface PreferencesContextProps {
  showWeekends: boolean;
  setShowWeekends: (show: boolean) => void;
  colorTheme: number; // active color theme index
  setColorTheme: (themeIndex: number) => void;
  // Preview/persistence controls for color theme
  setColorThemePreview?: (themeIndex: number) => void;
  suspendThemePersistence?: () => void;
  resumeThemePersistence?: () => void;
  language: string;
  timezone: string;
  mainListId: string | null; // currently selected main list
  setMainListId: (listId: string | null) => void;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
}

export interface CalendarContextProps {
  isInitialized: boolean;
  setIsInitialized: (isInitialized: boolean) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  modalPosition: { top: number; left: number } | null;
  setModalPosition: (position: { top: number; left: number } | null) => void;
  //EVENTS
  events: EventInterface[];
  hourlyEvents: Record<string, EventInterface[]>;
  dailyEvents: Record<string, EventInterface[]>;
  updateEvent: (event: EventInterface) => Promise<void>;
  addEvent: (event: Omit<EventInterface, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  //CALENDAR
  calendarClickContent: CalendarClickContent | null;
  setCalendarClickContent: (content: CalendarClickContent | null) => void;
  view: "month" | "week";
  setView: (view: "month" | "week") => void;
  goToday: () => void;
  loadNext: () => void;
  loadPrev: () => void;
}

// ShoppingContextProps moved to '@/data/Shopping/interfaces'

export interface PaymentsContextProps {
  payments: PaymentInterface[];
  addPayment: (paymentData: Omit<PaymentInterface, "id" | "userId">) => Promise<void>;
  markAsPaid: (paymentId: string) => Promise<void>;
  removePayment: (paymentId: string) => Promise<void>;
  togglePaymentStatus: (paymentId: string, isActive: boolean) => Promise<void>;
  updatePayment: (paymentId: string, updateData: Partial<PaymentInterface>) => Promise<void>;
}
