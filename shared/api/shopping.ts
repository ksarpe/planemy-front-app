import { APIError } from "@shared/data/Auth";
import { type ShoppingListInterface, type ShoppingItemInterface } from "@shared/data/Shopping/interfaces";

export const getShoppingLists = async (): Promise<ShoppingListInterface[]> => {
  return [];

  const response = await fetch("http://localhost:8080/api/v1/shopping-lists", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting shopping lists failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const getShoppingList = async (listId: string): Promise<ShoppingListInterface | undefined> => {
  if (!listId) {
    throw new Error("Shopping list ID is required");
  }
  return undefined;
  const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/${listId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting shopping list failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const addShoppingList = async (
  listData: Partial<ShoppingListInterface>,
): Promise<Partial<ShoppingListInterface>> => {
  const response = await fetch("http://localhost:8080/api/v1/shopping-lists", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding shopping list failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const updateShoppingList = async (
  listId: string,
  listData: Partial<ShoppingListInterface>,
): Promise<Partial<ShoppingListInterface>> => {
  if (!listId) {
    throw new Error("Shopping list ID is required for update");
  }
  const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/${listId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating shopping list failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const deleteShoppingList = async (listId: string): Promise<void> => {
  if (!listId) {
    throw new Error("Shopping list ID is required for deletion");
  }

  const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/${listId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting shopping list failed`, response.status, errorBody);
  }
};

// Shopping Items API functions
export const getShoppingItems = async (listId: string): Promise<ShoppingItemInterface[]> => {
  return [];

  if (!listId) {
    throw new Error("List ID is required to get shopping items");
  }

  const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/${listId}/items`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Getting shopping items failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const addShoppingItem = async (
  listId: string,
  itemData: Partial<ShoppingItemInterface>,
): Promise<Partial<ShoppingItemInterface>> => {
  if (!listId) {
    throw new Error("List ID is required to add shopping item");
  }

  const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/${listId}/items`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Adding shopping item failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const updateShoppingItem = async (
  listId: string,
  itemId: string,
  itemData: Partial<ShoppingItemInterface>,
): Promise<Partial<ShoppingItemInterface>> => {
  if (!listId) {
    throw new Error("List ID is required for update");
  }
  if (!itemId) {
    throw new Error("Item ID is required for update");
  }

  const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/${listId}/items/${itemId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Updating shopping item failed`, response.status, errorBody);
  }
  const data = await response.json();
  return data;
};

export const deleteShoppingItem = async (listId: string, itemId: string): Promise<void> => {
  if (!listId) {
    throw new Error("List ID is required for deletion");
  }
  if (!itemId) {
    throw new Error("Item ID is required for deletion");
  }

  const response = await fetch(`http://localhost:8080/api/v1/shopping-lists/${listId}/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new APIError(`Deleting shopping item failed`, response.status, errorBody);
  }
};
