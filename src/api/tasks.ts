import { TaskInterface } from "@/data/Tasks/interfaces";
import { db } from "./config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
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