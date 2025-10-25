import type { SharePermission, ShareStatus, ShareableObjectType } from "./types";

export interface ShareNotification {
  id?: string; // Firestore document ID
  object_id: string; // ID of the shared object
  object_type: ShareableObjectType; // Type of the shared object
  object_name: string; // Name of the object for display
  shared_by: string; // ID of user who shared
  shared_with: string; // ID of user receiving notification
  permission: SharePermission; // Permission level
  shared_at: string; // ISO string timestamp
  status: ShareStatus; // Notification status
}

export interface Permission {
  id?: string; // Firestore document ID
  object_id: string; // ID of the shared object (task list, event, shopping list)
  object_type: ShareableObjectType; // Type of the shared object
  user_id: string; // ID of the user with permission
  role: SharePermission; // Permission level
  granted_by: string; // ID of user who granted permission
  granted_at: string; // ISO string timestamp
  accepted_at?: string; // When user accepted invitation
  status: ShareStatus; // Invitation status
}

// Interfaces for Announcements System
export interface Announcement {
  id?: string; // Firestore document ID
  title: string; // Title of the announcement
  content: string; // Full content/message
  type: "info" | "warning" | "urgent" | "maintenance"; // Type of announcement
  priority: number; // Priority level (1 = highest, 5 = lowest)
  isActive: boolean; // Whether announcement is currently active
  startDate: string; // ISO string - when announcement becomes visible
  endDate?: string; // ISO string - when announcement expires (optional)
  createdBy: string; // Admin user ID who created it
  createdAt: string; // ISO string timestamp
  updatedAt: string; // ISO string timestamp
  targetAudience?: string[]; // Optional: specific user IDs (empty = all users)
}

export interface UserNotificationStatus {
  id?: string; // Firestore document ID
  announcementId: string; // Reference to announcement
  userId: string; // User who viewed/interacted
  isRead: boolean; // Whether user has read the full announcement
  readAt?: string; // ISO string - when user opened/read announcement
  createdAt: string; // ISO string - when first seen by user
}

// Frontend-friendly interface (camelCase)
export interface LabelInterface {
  id: string;
  label_name: string; // Transformed from label_name
  color: string; // hex color or predefined color class
  description?: string;
  userId: string; // Transformed from user_id
}

export interface LabelResponse {
  items: LabelInterface[];
  total: number;
  limit: number;
  offset: number;
}

export interface LabelConnection {
  id: string;
  userId: string;
  objectId: string;
  objectType: string;
  labelId: string;
  createdAt: string;
}

export interface LabelContextType {
  // Data
  labels: LabelInterface[];
  loading: boolean;
  error: string | null;

  // CRUD Operations
  createLabel: (name: string, color: string, description?: string) => Promise<void>;
  updateLabel: (labelId: string, updates: Partial<LabelInterface>) => Promise<void>;
  deleteLabel: (labelId: string) => Promise<void>;

  //Label Connections
  createLabelConnection: (objectId: string, objectType: string, labelId: string) => Promise<void>;
  removeLabelConnection: (objectId: string, objectType: string, labelId: string) => Promise<void>;
  removeAllLabelsFromObject: (objectId: string, objectType: string) => Promise<void>;
  //labelConnectionsByType: Map<string, Map<string, LabelInterface[]>>;

  // Utilities
  getLabelById: (labelId: string) => LabelInterface | undefined;
  //getLabelsForObject: (objectId: string, objectType: string) => LabelInterface[];
  //hasLabel: (objectId: string, objectType: string, labelId: string) => boolean;
  refreshLabels: () => void;
}

// Element positioning interfaces (moved from src/hooks/utils/useElementPosition.ts)
export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UseElementPositionProps {
  isOpen: boolean;
  elementPosition: ElementPosition;
  modalWidth?: number;
  modalHeight?: number;
  offset?: number;
}
