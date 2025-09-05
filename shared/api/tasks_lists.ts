import { db } from "./config";
import {
  collection,
  deleteDoc,
  addDoc,
  query,
  where,
  updateDoc,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { deleteAllTasksFromListApi } from "./tasks";
import { deleteAllPermissionsForObject } from "./permissions";
import { removeAllLabelConnectionsForTasksInList } from "./labels";

import type { TaskListInterface } from "../data/Tasks/interfaces";

/**
 * Pobiera wszystkie listy zadań dla danego użytkownika (jednorazowo).
 * Ta funkcja będzie w przyszłości podmieniona na zapytanie do API łączącego się z PostgreSQL.
 * @param userId - ID zalogowanego użytkownika.
 * @returns Promise<TaskListInterface[]>
 */
export const fetchUserTaskListsApi = async (userId: string): Promise<TaskListInterface[]> => {
  if (!userId) {
    return [];
  }
  const taskListsCollection = collection(db, "taskLists");
  const permissionsCollection = collection(db, "permissions");

  // Make two quereies for own lists and shared lists
  const ownListsQuery = query(taskListsCollection, where("userId", "==", userId));
  const sharedListsQuery = query(
    permissionsCollection,
    where("user_id", "==", userId),
    where("object_type", "==", "task_list"),
    where("status", "==", "accepted"),
  );
  // Make two synchronous queries
  const [ownListsSnapshot, sharedPermissionsSnapshot] = await Promise.all([
    getDocs(ownListsQuery),
    getDocs(sharedListsQuery),
  ]);

  // Get both lists
  const ownLists = ownListsSnapshot.docs.map((doc) => ({
    id: doc.data().id || doc.id,
    ...doc.data(),
  })) as TaskListInterface[];
  const sharedListIds = sharedPermissionsSnapshot.docs.map((doc) => doc.data().object_id);
  let sharedLists: TaskListInterface[] = [];

  if (sharedListIds.length > 0) {
    // Uwaga: Zapytanie 'in' w Firestore jest ograniczone do 30 elementów.
    // Dla większej liczby udostępnień należałoby podzielić zapytania na mniejsze paczki.
    const sharedListsQuery = query(taskListsCollection, where("id", "in", sharedListIds));
    const sharedListsSnapshot = await getDocs(sharedListsQuery);
    sharedLists = sharedListsSnapshot.docs.map((doc) => ({
      id: doc.data().id || doc.id,
      ...doc.data(),
    })) as TaskListInterface[];
  }

  const allListsMap = new Map<string, TaskListInterface>();
  ownLists.forEach((list) => {
    allListsMap.set(list.id, list);
  });
  sharedLists.forEach((list) => {
    allListsMap.set(list.id, list);
  });

  const combinedLists = Array.from(allListsMap.values());

  if (combinedLists.length === 0) {
    return []; // Zwróć pustą tablicę, jeśli nie ma żadnych list do przetworzenia
  }

  const enrichedListsPromises = combinedLists.map(async (list) => {
    const tasksCollection = collection(db, "tasks");
    const totalTasksQuery = query(tasksCollection, where("taskListId", "==", list.id));
    const totalPromise = getCountFromServer(totalTasksQuery);

    const [totalSnapshot] = await Promise.all([totalPromise]);

    return {
      ...list,
      totalTasks: totalSnapshot.data().count,
    };
  });

  // Poczekaj na zakończenie wszystkich operacji zliczania i zwróć wynik
  console.log("Fetched task lists:", combinedLists);
  return await Promise.all(enrichedListsPromises);
};

// Create a new task list
export const createTaskListApi = async (name: string, userId: string, id: string): Promise<void> => {
  try {
    const taskListsCollection = collection(db, "taskLists");
    const newTaskList: TaskListInterface = {
      id,
      name,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addDoc(taskListsCollection, newTaskList);
  } catch (error) {
    console.error("Error creating task list:", error);
    throw error;
  }
};

// Update task list
export const updateTaskListApi = async (listId: string, updates: Partial<TaskListInterface>): Promise<void> => {
  try {
    const taskListsCollection = collection(db, "taskLists");
    const taskListQuery = query(taskListsCollection, where("id", "==", listId));
    const snapshot = await getDocs(taskListQuery);

    if (!snapshot.empty) {
      const taskListDoc = snapshot.docs[0];
      await updateDoc(taskListDoc.ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error updating task list:", error);
    throw error;
  }
};

// Delete task list
export const deleteTaskListApi = async (listId: string, userId: string): Promise<void> => {
  try {
    // Step 1: Remove all label connections for tasks in this list (before deleting tasks)
    await removeAllLabelConnectionsForTasksInList(userId, listId);

    // Step 2: Delete all tasks from the list
    await deleteAllTasksFromListApi(listId);

    // Step 3: Delete all permissions/shares for this task list
    await deleteAllPermissionsForObject(listId, "task_list");

    // Step 4: Delete the task list itself
    const taskListsCollection = collection(db, "taskLists");
    const taskListQuery = query(taskListsCollection, where("id", "==", listId));
    const snapshot = await getDocs(taskListQuery);

    if (!snapshot.empty) {
      const taskListDoc = snapshot.docs[0];
      await deleteDoc(taskListDoc.ref);
    }

    console.log(`Successfully deleted task list ${listId} with all its tasks, permissions and task labels`);
  } catch (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
}; // Clear completed tasks from a list
export const clearCompletedTasks = async (listId: string): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const completedTasksQuery = query(
      tasksCollection,
      where("taskListId", "==", listId),
      where("isCompleted", "==", true),
    );

    const snapshot = await getDocs(completedTasksQuery);
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing completed tasks:", error);
    throw error;
  }
};

// Uncheck all tasks in a list
export const uncheckAllTasks = async (listId: string): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const completedTasksQuery = query(
      tasksCollection,
      where("taskListId", "==", listId),
      where("isCompleted", "==", true),
    );

    const snapshot = await getDocs(completedTasksQuery);
    const updatePromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        isCompleted: false,
        updatedAt: new Date().toISOString(),
      }),
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error unchecking all tasks:", error);
    throw error;
  }
};
