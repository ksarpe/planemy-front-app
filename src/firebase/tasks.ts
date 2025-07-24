import { useEffect, useState } from "react";
import { db } from "./config";
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, query, where, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export interface Task {
  completed: boolean;
  description: string;
  dueDate: string;
  id: string;
  title: string;
  priority?: 'low' | 'medium' | 'high';
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useUserTasks = (): Task[] => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setTasks([]);
            return;
        }

        const sortTasks = (tasks: Task[]) => {
            return tasks.sort(
                (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
            );
        };

        const tasksCollection = collection(db, "tasks");
        const userTasksQuery = query(tasksCollection, where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(userTasksQuery, (snapshot) => {
            const taskList: Task[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];

            setTasks(sortTasks(taskList));
        });

        return () => {
            unsubscribe();
        };
    }, [user]);

    return tasks;
};

// Function to add a new task
export const addTask = async (
  title: string, 
  userId: string, 
  description?: string, 
  dueDate?: string, 
  priority?: 'low' | 'medium' | 'high'
): Promise<void> => {
    try {
        const tasksCollection = collection(db, "tasks");
        const newTask = {
            title,
            description: description || "",
            dueDate: dueDate || new Date().toISOString().split('T')[0], // Default to today
            completed: false,
            priority: priority || 'medium',
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        
        await addDoc(tasksCollection, newTask);
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};

//update task function
export const updateTask = async (taskId: string, title?: string, description?: string): Promise<void> => {
    try {
        const tasksCollection = collection(db, "tasks");
        const taskDocRef = doc(tasksCollection, taskId);
        await setDoc(taskDocRef, {
            title,
            description,
        }, { merge: true });
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

//remove task function
export const removeTask = async (taskId: string): Promise<void> => {
    try {
        const tasksCollection = collection(db, "tasks");
        const taskDocRef = doc(tasksCollection, taskId);
        await deleteDoc(taskDocRef);
    } catch (error) {
        console.error("Error removing task:", error);
        throw error;
    }
};

// Function to mark a task as done or undone
export const markTaskAsDoneOrUndone = async (taskId: string): Promise<void> => {
    try {
        const tasksCollection = collection(db, "tasks");
        const taskDocRef = doc(tasksCollection, taskId);
        // Pobierz aktualny stan zadania
        const { getDoc } = await import("firebase/firestore");
        const taskSnapshot = await getDoc(taskDocRef);
        if (taskSnapshot.exists()) {
            const currentTask = taskSnapshot.data() as Task;
            await setDoc(taskDocRef, {
                ...currentTask,
                completed: !currentTask.completed,
            });
        } else {
            throw new Error("Task not found");
        }
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};



