import { buildApiUrl } from "@shared/config/api";
import { APIError } from "../data/Auth";
import { type Permission, type ShareNotification } from "../data/Utils/interfaces";
import { type SharePermission, type ShareableObjectType } from "../data/Utils/types";

// Permissions API functions
export const getPermissions = async (): Promise<Permission[]> => {
  const response = await fetch(buildApiUrl("permissions"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting permissions failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const getPermission = async (permissionId: string): Promise<Permission | undefined> => {
  if (!permissionId) {
    throw new Error("Permission ID is required");
  }

  const response = await fetch(buildApiUrl(`permissions/${permissionId}`), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting permission failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const getPermissionsForObject = async (
  objectId: string,
  objectType: ShareableObjectType,
): Promise<Permission[]> => {
  if (!objectId || !objectType) {
    throw new Error("Object ID and object type are required");
  }

  const response = await fetch(buildApiUrl(`permissions/object/${objectId}/${objectType}`), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting permissions for object failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const addPermission = async (permissionData: Partial<Permission>): Promise<Partial<Permission>> => {
  const response = await fetch(buildApiUrl("permissions"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(permissionData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding permission failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const updatePermission = async (
  permissionId: string,
  permissionData: Partial<Permission>,
): Promise<Partial<Permission>> => {
  if (!permissionId) {
    throw new Error("Permission ID is required for update");
  }

  const response = await fetch(buildApiUrl(`permissions/${permissionId}`), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(permissionData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating permission failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const deletePermission = async (permissionId: string): Promise<void> => {
  if (!permissionId) {
    throw new Error("Permission ID is required for deletion");
  }

  const response = await fetch(buildApiUrl(`permissions/${permissionId}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting permission failed`, response.status, errorBody);
  }
};

// Share Notifications API functions
export const getShareNotifications = async (): Promise<ShareNotification[]> => {
  const response = await fetch(buildApiUrl("share-notifications"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting share notifications failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const getPendingShareNotifications = async (): Promise<ShareNotification[]> => {
  const response = await fetch(buildApiUrl("share-notifications/pending"), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting pending share notifications failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const addShareNotification = async (
  notificationData: Partial<ShareNotification>,
): Promise<Partial<ShareNotification>> => {
  const response = await fetch(buildApiUrl("share-notifications"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notificationData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding share notification failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const updateShareNotification = async (
  notificationId: string,
  notificationData: Partial<ShareNotification>,
): Promise<Partial<ShareNotification>> => {
  if (!notificationId) {
    throw new Error("Notification ID is required for update");
  }

  const response = await fetch(buildApiUrl(`share-notifications/${notificationId}`), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notificationData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating share notification failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const deleteShareNotification = async (notificationId: string): Promise<void> => {
  if (!notificationId) {
    throw new Error("Notification ID is required for deletion");
  }

  const response = await fetch(buildApiUrl(`share-notifications/${notificationId}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting share notification failed`, response.status, errorBody);
  }
};

// Convenience functions for common sharing operations
export const shareObject = async (
  objectId: string,
  objectType: ShareableObjectType,
  targetUserEmail: string,
  permission: SharePermission,
): Promise<Partial<ShareNotification>> => {
  const response = await fetch(buildApiUrl("share-notifications/share"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      objectId,
      objectType,
      targetUserEmail,
      permission,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Sharing object failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const acceptShareInvitation = async (notificationId: string): Promise<void> => {
  if (!notificationId) {
    throw new Error("Notification ID is required");
  }

  const response = await fetch(buildApiUrl(`share-notifications/${notificationId}/accept`), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Accepting share invitation failed`, response.status, errorBody);
  }
};

export const rejectShareInvitation = async (notificationId: string): Promise<void> => {
  if (!notificationId) {
    throw new Error("Notification ID is required");
  }

  const response = await fetch(buildApiUrl(`share-notifications/${notificationId}/reject`), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Rejecting share invitation failed`, response.status, errorBody);
  }
};
