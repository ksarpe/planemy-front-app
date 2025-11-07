import { APIError } from "../data/Auth";
import { colorNameToHex, hexToColorName } from "../data/Utils/colors";
import {
  LabelConnectionResponse,
  LabelResponse,
  type LabelConnection,
  type LabelInterface,
} from "../data/Utils/interfaces";

// Labels API functions
export const getLabels = async (): Promise<LabelResponse> => {
  const response = await fetch("http://localhost:8080/api/v1/labels", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting labels failed`, response.status, errorBody);
  }
  const data = await response.json();

  // Convert hex colors back to color names for frontend
  if (data.items && Array.isArray(data.items)) {
    data.items = data.items.map((label: LabelInterface) => ({
      ...label,
      color: hexToColorName(label.color),
    }));
  }

  return data;
};

export const getLabel = async (labelId: string): Promise<LabelInterface | undefined> => {
  if (!labelId) {
    throw new Error("Label ID is required");
  }

  const response = await fetch(`http://localhost:8080/api/v1/labels/${labelId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting label failed`, response.status, errorBody);
  }
  const data = await response.json();

  // Convert hex color back to color name for frontend
  if (data.color) {
    data.color = hexToColorName(data.color);
  }

  return data;
};

export const addLabel = async (labelData: Partial<LabelInterface>): Promise<Partial<LabelInterface>> => {
  // Convert color name to hex for backend
  const dataToSend = {
    ...labelData,
    color: colorNameToHex(labelData.color),
  };

  const response = await fetch("http://localhost:8080/api/v1/labels", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding label failed`, response.status, errorBody);
  }
  const data = await response.json();

  // Convert hex back to color name for frontend
  if (data.color) {
    data.color = hexToColorName(data.color);
  }

  return data;
};

export const updateLabel = async (
  labelId: string,
  labelData: Partial<LabelInterface>,
): Promise<Partial<LabelInterface>> => {
  if (!labelId) {
    throw new Error("Label ID is required for update");
  }

  // Convert color name to hex for backend if color is being updated
  const dataToSend = {
    ...labelData,
    ...(labelData.color && { color: colorNameToHex(labelData.color) }),
  };

  const response = await fetch(`http://localhost:8080/api/v1/labels/${labelId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating label failed`, response.status, errorBody);
  }
  const data = await response.json();

  // Convert hex back to color name for frontend
  if (data.color) {
    data.color = hexToColorName(data.color);
  }

  return data;
};

export const deleteLabel = async (labelId: string): Promise<void> => {
  if (!labelId) {
    throw new Error("Label ID is required for deletion");
  }

  const response = await fetch(`http://localhost:8080/api/v1/labels/${labelId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting label failed`, response.status, errorBody);
  }
};

// Label Connections API functions
export const getLabelConnections = async (objectId?: string, objectType?: string): Promise<LabelConnectionResponse> => {
  let url = "http://localhost:8080/api/v1/label-connections";
  const params = new URLSearchParams();

  if (objectId) params.append("objectId", objectId);
  if (objectType) params.append("objectType", objectType);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting label connections failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const addLabelConnection = async (
  connectionData: Pick<LabelConnection, "entity_id" | "entity_type" | "label_id">,
): Promise<Partial<LabelConnection>> => {
  const response = await fetch("http://localhost:8080/api/v1/label-connections", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(connectionData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding label connection failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

// Set or update label connection (ensures only one label per object)
export const setLabelConnection = async (
  connectionData: Pick<LabelConnection, "entity_id" | "entity_type" | "label_id">,
): Promise<Partial<LabelConnection>> => {
  // First, get all existing connections for this object
  const existingConnections = await getLabelConnections();

  // Delete each existing connection individually
  if (existingConnections.items && existingConnections.items.length > 0) {
    await Promise.all(
      existingConnections.items
        .filter((connection) => connection.entity_id == connectionData.entity_id)
        .map((connection) => deleteLabelConnection(connection.id)),
    );
  }

  // Then create the new connection
  return addLabelConnection(connectionData);
};

export const deleteLabelConnection = async (connectionId: string): Promise<void> => {
  if (!connectionId) {
    throw new Error("Connection ID is required for deletion");
  }

  const response = await fetch(`http://localhost:8080/api/v1/label-connections/${connectionId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting label connection failed`, response.status, errorBody);
  }
};

// COMMENTED OUT - These endpoints don't exist on the server
// export const deleteLabelConnectionByParams = async (
//   objectId: string,
//   objectType: string,
//   labelId: string,
// ): Promise<void> => {
//   if (!objectId || !objectType || !labelId) {
//     throw new Error("Object ID, object type, and label ID are required");
//   }

//   const response = await fetch(`http://localhost:8080/api/v1/label-connections/by-params`, {
//     method: "DELETE",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       objectId,
//       objectType,
//       labelId,
//     }),
//   });

//   if (!response.ok) {
//     const errorBody = await response.json();
//     throw new APIError(`Deleting label connection failed`, response.status, errorBody);
//   }
// };

// export const deleteAllLabelConnectionsForObject = async (objectId: string, objectType: string): Promise<void> => {
//   if (!objectId || !objectType) {
//     throw new Error("Object ID and object type are required");
//   }

//   const response = await fetch(`http://localhost:8080/api/v1/label-connections/object/${objectId}/${objectType}`, {
//     method: "DELETE",
//     credentials: "include",
//   });

//   if (!response.ok) {
//     const errorBody = await response.json();
//     throw new APIError(`Deleting all label connections for object failed`, response.status, errorBody);
//   }
// };
