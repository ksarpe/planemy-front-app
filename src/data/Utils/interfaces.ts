import type { SharePermission, ShareStatus, ShareableObjectType } from "@/data/Utils/types";


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

export interface LabelInterface {
  id: string;
  name: string;
  color: string; // hex color or predefined color class
  description?: string;
  userId: string;
}