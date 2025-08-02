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

import type { TaskListInterface } from "@/data/Tasks/interfaces";

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

  // Krok 1: Pobierz podstawowe dane o listach (tak jak wcześniej)
  // TODO: Dodać logikę pobierania list udostępnionych
  const taskListsCollection = collection(db, "taskLists");
  const ownListsQuery = query(taskListsCollection, where("userId", "==", userId));
  const snapshot = await getDocs(ownListsQuery);

  const listsWithoutCounts = snapshot.docs.map((doc) => ({
    id: doc.data().id || doc.id,
    ...doc.data(),
  })) as TaskListInterface[];

  // Krok 2: Dla każdej listy, stwórz obietnicę (Promise), która pobierze jej statystyki
  const enrichedListsPromises = listsWithoutCounts.map(async (list) => {
    const tasksCollection = collection(db, "tasks");

    // Zapytanie o wszystkie zadania w tej liście
    const totalTasksQuery = query(tasksCollection, where("taskListId", "==", list.id));
    // Zapytanie o ukończone zadania w tej liście
    const completedTasksQuery = query(
      tasksCollection,
      where("taskListId", "==", list.id),
      where("isCompleted", "==", true),
    );

    // Użyj `getCountFromServer` do efektywnego liczenia
    const totalPromise = getCountFromServer(totalTasksQuery);
    const completedPromise = getCountFromServer(completedTasksQuery);

    // Wykonaj oba zapytania o zliczenie równolegle
    const [totalSnapshot, completedSnapshot] = await Promise.all([totalPromise, completedPromise]);

    // Zwróć oryginalny obiekt listy wzbogacony o nowe dane
    return {
      ...list,
      totalTasks: totalSnapshot.data().count,
      completedTasks: completedSnapshot.data().count,
    };
  });

  // Krok 3: Poczekaj, aż wszystkie obietnice pobrania statystyk się zakończą
  const enrichedLists = await Promise.all(enrichedListsPromises);

  // Krok 4: Zwróć w pełni wzbogacone listy
  return enrichedLists;
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
export const deleteTaskListApi = async (listId: string): Promise<void> => {
  try {
    const taskListsCollection = collection(db, "taskLists");
    const taskListQuery = query(taskListsCollection, where("id", "==", listId));
    const snapshot = await getDocs(taskListQuery);

    if (!snapshot.empty) {
      const taskListDoc = snapshot.docs[0];
      await deleteDoc(taskListDoc.ref);
    }
  } catch (error) {
    console.error("Error deleting task list:", error);
    throw error;
  }
};

// Clear completed tasks from a list
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