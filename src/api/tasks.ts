import { TaskInterface } from "@/data/Tasks/interfaces";
import { db } from "./config";
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const fetchTasksForListApi = async (listId: string): Promise<TaskInterface[]> => {
  const tasksCollection = collection(db, "tasks");
  const q = query(tasksCollection, where("taskListId", "==", listId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TaskInterface[];
};

// Add task to list - now creates task in separate collection
export const createTaskApi = async (
  listId: string,
  title: string,
  userId: string,
  description?: string | null,
  dueDate?: string | null,
): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const newTask: TaskInterface = {
      id: uuidv4(),
      title,
      description: description || "",
      dueDate: dueDate || "",
      isCompleted: false,
      userId,
      taskListId: listId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addDoc(tasksCollection, newTask);
  } catch (error) {
    console.error("Error adding task to list:", error);
    throw error;
  }
};

// Update task - now updates task in tasks collection
export const updateTaskApi = async (taskId: string, updates: Partial<TaskInterface>): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const taskQuery = query(tasksCollection, where("id", "==", taskId));
    const snapshot = await getDocs(taskQuery);

    if (!snapshot.empty) {
      const taskDoc = snapshot.docs[0];
      await updateDoc(taskDoc.ref, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Remove task from list - now deletes task from tasks collection
export const removeTaskApi = async (taskId: string): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const taskQuery = query(tasksCollection, where("id", "==", taskId));
    console.log(taskId);
    const snapshot = await getDocs(taskQuery);

    if (!snapshot.empty) {
      const taskDoc = snapshot.docs[0];
      await deleteDoc(taskDoc.ref);
    }
  } catch (error) {
    console.error("Error removing task from list:", error);
    throw error;
  }
};

// Toggle task completion - now updates task in tasks collection
export const completeTaskApi = async (taskId: string): Promise<void> => {
  try {
    const tasksCollection = collection(db, "tasks");
    const taskQuery = query(tasksCollection, where("id", "==", taskId));
    const snapshot = await getDocs(taskQuery);

    if (!snapshot.empty) {
      const currentTask = snapshot.docs[0].data() as TaskInterface;
      await updateDoc(snapshot.docs[0].ref, {
        isCompleted: !currentTask.isCompleted,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};