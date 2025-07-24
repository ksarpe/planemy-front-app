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

export type EventColor = "bg-red-500" | "bg-blue-400" | "bg-yellow-500" | "bg-green-500";
export type EventCategory = "Important" | "Meeting" | "Holiday" | "Other" | "Test";
export interface EventInterface {
  id: number;
  title: string;
  category: EventCategory;
  start: string;
  end: string;
  allDay: boolean;
  classNames: string;
  color: string;
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

export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
