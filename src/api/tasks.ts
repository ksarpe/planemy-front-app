import { TaskInterface } from "@/data/Tasks/interfaces";
import { db } from "./config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchTasksForListApi = async (listId: string): Promise<TaskInterface[]> => {
  const tasksCollection = collection(db, "tasks");
  const q = query(tasksCollection, where("taskListId", "==", listId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TaskInterface[];
};