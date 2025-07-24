import type {
  EventInterface,
  CalendarClickContent,
  PaymentInterface,
  ShoppingListInterface,
  FavoriteProductInterface,
  ShoppingCategoryInterface,
  ShoppingItemInterface,
  TaskInterface,
} from "./types";

export interface ToastContextProps {
  showToast: (type: "success" | "error" | "warning", message: string) => void;
}

export interface PreferencesContextProps {
  dayStartTime: string; // keeps track of when calendar scroll should start
  setDayStartTime: (time: string) => void;
  showWeekends: boolean;
  setShowWeekends: (show: boolean) => void;
  isDark: boolean; //theme
  toggleTheme: () => void;
  isSidebarClosed: boolean; // sidebar state
  setIsSidebarClosed: (isClosed: boolean) => void;
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
  setEventList: (events: EventInterface[]) => void;
  updateEvent: (event: EventInterface) => void;
  //CALENDAR
  calendarClickContent: CalendarClickContent | null;
  setCalendarClickContent: (content: CalendarClickContent | null) => void;
  view: "month" | "week";
  setView: (view: "month" | "week") => void;
  goToday: () => void;
  loadNext: () => void;
  loadPrev: () => void;
}

export interface TaskContextProps {
  tasks: TaskInterface[];
  clickedTask: TaskInterface | null;
  setClickedTask: (task: TaskInterface | null) => void;
  addTask: (title: string, description?: string, dueDate?: string, priority?: 'low' | 'medium' | 'high') => Promise<void>;
  markTaskAsDoneOrUndone: (id: string) => Promise<void>;
  convertToEvent: () => void;
  updateTask: (title?: string, description?: string) => Promise<void>;
  removeTask: () => Promise<void>;
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
  addItem: (listId: string, item: Omit<ShoppingItemInterface, 'id' | 'addedAt'>) => Promise<void>;
  updateItem: (listId: string, itemId: string, updates: Partial<ShoppingItemInterface>) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;
  toggleItemComplete: (listId: string, itemId: string) => Promise<void>;
  
  // Favorite Products
  favoriteProducts: FavoriteProductInterface[];
  addToFavorites: (product: Omit<FavoriteProductInterface, 'id'>) => Promise<void>;
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
  addPayment: (paymentData: Omit<PaymentInterface, 'id' | 'userId'>) => Promise<void>;
  markAsPaid: (paymentId: string) => Promise<void>;
  removePayment: (paymentId: string) => Promise<void>;
  togglePaymentStatus: (paymentId: string, isActive: boolean) => Promise<void>;
  updatePayment: (paymentId: string, updateData: Partial<PaymentInterface>) => Promise<void>;
}
