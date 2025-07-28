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

// User interface for sharing system
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
}

// Sharing permission levels
export type SharePermission = "view" | "edit" | "admin";

// Object types that can be shared
export type ShareableObjectType = "task_list" | "event" | "shopping_list";

// NEW: Generic permission entry for any shareable object
export interface Permission {
  id?: string; // Firestore document ID
  object_id: string; // ID of the shared object (task list, event, shopping list)
  object_type: ShareableObjectType; // Type of the shared object
  user_id: string; // ID of the user with permission
  role: SharePermission; // Permission level
  granted_by: string; // ID of user who granted permission
  granted_at: string; // ISO string timestamp
  accepted_at?: string; // When user accepted invitation
  status: "pending" | "accepted" | "rejected" | "revoked"; // Invitation status
}

// Legacy: Task list permission entry (for backwards compatibility)
export interface TaskListPermission {
  id?: string; // Firestore document ID
  list_id: string; // ID of the task list
  user_id: string; // ID of the user with permission
  role: SharePermission; // Permission level
  granted_by: string; // ID of user who granted permission
  granted_at: string; // ISO string timestamp
  accepted_at?: string; // When user accepted invitation
  status: "pending" | "accepted" | "rejected"; // Invitation status
}

// Legacy: Shared task list entry (for backwards compatibility)
export interface SharedTaskList {
  id?: string; // For invitation documents
  listId: string;
  sharedBy: string; // user ID who shared
  permission: SharePermission;
  sharedAt: string;
  acceptedAt?: string;
}

// Generic notification for any shared object
export interface ShareNotification {
  id?: string; // Firestore document ID
  object_id: string; // ID of the shared object
  object_type: ShareableObjectType; // Type of the shared object
  object_name: string; // Name of the object for display
  shared_by: string; // ID of user who shared
  shared_with: string; // ID of user receiving notification
  permission: SharePermission; // Permission level
  shared_at: string; // ISO string timestamp
  status: "pending" | "accepted" | "rejected" | "revoked"; // Notification status
}

// Legacy: Simple notification for task list sharing (for backwards compatibility)
export interface TaskListNotification {
  id?: string; // Firestore document ID
  listId: string; // ID of the task list
  listName: string; // Name of the task list for display
  sharedBy: string; // ID of user who shared
  sharedWith: string; // ID of user receiving notification
  permission: SharePermission; // Permission level
  sharedAt: string; // ISO string timestamp
  status: "pending" | "accepted" | "rejected"; // Notification status
}

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
  userId: string; // Creator of the task
  taskListId: string; // Foreign key to TaskList
  sharedBy?: string; // ID of user who originally created the task (for shared lists)
  createdAt?: string;
  updatedAt?: string;
}

// NEW TaskList interface according to system design - no longer contains tasks array
export interface TaskListInterface {
  id: string;
  name: string;
  labels?: LabelInterface[]; // Optional array of labels for the list
  userId: string; // Owner of the list
  createdAt?: string;
  updatedAt?: string;
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
