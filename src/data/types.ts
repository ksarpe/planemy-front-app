export interface PaymentInterface {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: "weekly" | "monthly" | "quarterly" | "yearly";
  category: "subscription" | "utility" | "insurance" | "loan" | "rent" | "other";
  description?: string;
  nextPaymentDate: string;
  lastPaymentDate?: string;
  isActive: boolean;
  isPaid: boolean;
  autoRenew: boolean;
  reminderDays: number;
  userId: string;
}

export interface InventoryItem {
  id: string;
  label: string;
  xp: string;
  icon: string;
}

export type EventColor = "bg-red-500" | "bg-blue-400" | "bg-yellow-500" | "bg-green-500" | "bg-purple-500" | "bg-pink-500" | "bg-indigo-500" | "bg-orange-500";
export type EventCategory = "Important" | "Meeting" | "Holiday" | "Health" | "Personal" | "Work" | "Travel" | "Fitness" | "Social" | "Finance" | "Other";

// Enum for recurring patterns
export type RecurrencePattern = "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly" | "custom";

// Enum for display types
export type EventDisplayType = "standard" | "icon";

// Recurrence rules interface
export interface RecurrenceRule {
  pattern: RecurrencePattern;
  interval: number; // every X days/weeks/months
  endDate?: string;
  count?: number; // number of occurrences
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  monthlyType?: "date" | "day"; // repeat on date (15th) or day (3rd Monday)
  exceptions?: string[]; // dates to skip
}

// Enhanced event interface
export interface EventInterface {
  id: string; // Changed to string for Firebase compatibility
  title: string;
  description?: string;
  category: EventCategory;
  start: string;
  end: string;
  allDay: boolean;
  
  // Styling and display
  color: string;
  displayType: EventDisplayType;
  icon?: string; // lucide icon name or emoji
  iconColor?: string;
  
  // Recurrence
  isRecurring: boolean;
  recurrence?: RecurrenceRule;
  originalEventId?: string; // for recurring event instances
  
  // Location and attendees
  location?: string;
  attendees?: string[];
  
  // Privacy and permissions
  isPrivate: boolean;
  visibility: "public" | "private" | "shared";
  sharedWith?: string[];
  
  // Metadata
  userId: string;
  createdAt: string;
  updatedAt: string;
  
  // Health tracking specific (for period tracking, etc.)
  healthData?: {
    type: "period" | "ovulation" | "medication" | "symptom" | "mood" | "weight" | "other";
    notes?: string;
    symptoms?: string[];
  };
  
  // Legacy fields for backwards compatibility
  classNames?: string;
  colSpan?: number;
}
export interface CalendarClickContent {
  type: "event" | "date" | "date-range";
  data: EventInterface | Date | null;
  additionalData?: AdditionalDataInterface;
}

export interface AdditionalDataInterface {
  isPeriod: boolean;
  isOvulation: boolean;
}

// NEW TASK SYSTEM - Updated according to system design

// Label interface for categorizing and organizing tasks
export interface LabelInterface {
  id: string;
  name: string;
  color: string; // hex color or predefined color class
  description?: string;
  userId: string;
}

// Updated Task interface according to system design
export interface TaskInterface {
  id: string;
  title: string;
  description?: string; // Optional textarea
  dueDate?: string; // Optional datetime
  isCompleted: boolean;
  labels?: LabelInterface[]; // Optional array of labels
  userId: string;
}

// NEW TaskList interface according to system design
export interface TaskListInterface {
  id: string;
  name: string;
  tasks: TaskInterface[]; // Array of tasks
  labels?: LabelInterface[]; // Optional array of labels for the list
  sharedWith: string[]; // Array of user IDs
  userId: string; // Owner of the list
}

// Legacy interface for backwards compatibility (if needed)
export interface QuickTaskInterface {
  id: number;
  title: string;
}

export interface ShoppingItemInterface {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price?: number;
  isFavorite: boolean;
  isCompleted: boolean;
  addedAt: Date;
  completedAt?: Date | null;
  notes?: string;
}

export interface ShoppingListInterface {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  items: ShoppingItemInterface[];
  isShared: boolean;
  sharedWith: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  type: "personal" | "shared" | "template";
  color?: string;
}

export interface FavoriteProductInterface {
  id: string;
  name: string;
  category: string;
  unit: string;
  price?: number;
  brand?: string;
  barcode?: string;
  notes?: string;
  usageCount: number;
  lastUsed: Date;
  userId: string;
}

export interface ShoppingCategoryInterface {
  id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
}

export interface HolidayInterface {
  date: string;
  localName: string;
  category: string;
}
