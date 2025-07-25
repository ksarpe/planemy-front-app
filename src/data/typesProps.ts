import type {
  EventInterface,
  CalendarClickContent,
  PaymentInterface,
  ShoppingListInterface,
  FavoriteProductInterface,
  ShoppingCategoryInterface,
  ShoppingItemInterface,
  TaskInterface,
  TaskListInterface,
  LabelInterface,
  UserProfile,
  SharePermission,
  SharedTaskList,
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

export interface TaskContextProps {
  // Task Lists
  taskLists: TaskListInterface[];
  currentTaskList: TaskListInterface | null;
  setCurrentTaskList: (taskList: TaskListInterface | null) => void;
  createTaskList: (name: string) => Promise<void>;
  updateTaskList: (listId: string, updates: Partial<TaskListInterface>) => Promise<void>;
  deleteTaskList: (listId: string) => Promise<void>;
  
  // Sharing functionality
  shareTaskList: (listId: string, userEmail: string, permission: SharePermission) => Promise<void>;
  unshareTaskList: (listId: string, userId: string) => Promise<void>;
  acceptSharedList: (shareId: string) => Promise<void>;
  rejectSharedList: (shareId: string) => Promise<void>;
  updateSharePermission: (listId: string, userId: string, permission: SharePermission) => Promise<void>;
  searchUsers: (email: string) => Promise<UserProfile[]>;
  getSharedLists: () => TaskListInterface[];
  getPendingShares: () => SharedTaskList[];
  
  // Tasks within lists
  addTask: (listId: string, title: string, description?: string | null, dueDate?: string | null, labels?: LabelInterface[]) => Promise<void>;
  updateTask: (listId: string, taskId: string, updates: Partial<TaskInterface>) => Promise<void>;
  removeTask: (listId: string, taskId: string) => Promise<void>;
  toggleTaskComplete: (listId: string, taskId: string) => Promise<void>;
  moveTask: (taskId: string, fromListId: string, toListId: string) => Promise<void>;
  
  // Labels
  labels: LabelInterface[];
  createLabel: (name: string, color: string, description?: string) => Promise<void>;
  updateLabel: (labelId: string, updates: Partial<LabelInterface>) => Promise<void>;
  deleteLabel: (labelId: string) => Promise<void>;
  addLabelToTask: (listId: string, taskId: string, label: LabelInterface) => Promise<void>;
  removeLabelFromTask: (listId: string, taskId: string, labelId: string) => Promise<void>;
  
  // UI State
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLabels: LabelInterface[];
  setSelectedLabels: (labels: LabelInterface[]) => void;
  
  // Legacy support (for backwards compatibility)
  clickedTask: TaskInterface | null;
  setClickedTask: (task: TaskInterface | null) => void;
  convertToEvent: () => void;
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
