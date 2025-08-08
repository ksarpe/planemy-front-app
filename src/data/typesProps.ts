import type {
  EventInterface,
  CalendarClickContent,
  PaymentInterface,
  ShoppingListInterface,
  FavoriteProductInterface,
  ShoppingCategoryInterface,
  ShoppingItemInterface,
} from "./types";
import { UserSettings } from "./User/interfaces";

export interface ToastContextProps {
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}

export interface PreferencesContextProps {
  showWeekends: boolean;
  setShowWeekends: (show: boolean) => void;
  isDark: boolean; //theme
  toggleTheme: () => void;
  colorTheme: number; // active color theme index
  setColorTheme: (themeIndex: number) => void;
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

export interface ShoppingContextProps {
  // Shopping Lists
  shoppingLists: ShoppingListInterface[];
  currentList: ShoppingListInterface | null;
  setCurrentList: (list: ShoppingListInterface | null) => void;
  createList: (name: string, description?: string, emoji?: string, color?: string) => Promise<void>;
  updateList: (listId: string, updates: Partial<ShoppingListInterface>) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;

  // Shopping Items
  addItem: (listId: string, item: Omit<ShoppingItemInterface, "id" | "addedAt">) => Promise<void>;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItemInterface>) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
  toggleItemComplete: (listId: string, itemId: string) => Promise<void>;

  // Favorite Products
  favoriteProducts: FavoriteProductInterface[];
  addToFavorites: (product: Omit<FavoriteProductInterface, "id">) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  addFavoriteToList: (listId: string, product: FavoriteProductInterface, quantity?: number) => Promise<void>;

  // Categories
  categories: ShoppingCategoryInterface[];

  // UI State
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export interface PaymentsContextProps {
  payments: PaymentInterface[];
  addPayment: (paymentData: Omit<PaymentInterface, "id" | "userId">) => Promise<void>;
  markAsPaid: (paymentId: string) => Promise<void>;
  removePayment: (paymentId: string) => Promise<void>;
  togglePaymentStatus: (paymentId: string, isActive: boolean) => Promise<void>;
  updatePayment: (paymentId: string, updateData: Partial<PaymentInterface>) => Promise<void>;
}
