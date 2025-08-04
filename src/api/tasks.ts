import { TaskInterface } from "@/data/Tasks/interfaces";
import { db } from "./config";
import { addDoc, collection, deleteDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { LabelInterface } from "@/data/Utils/interfaces";

export const fetchTasksForListApi = async (listId: string): Promise<TaskInterface[]> => {
  if (!listId) return [];

  // --- Krok 1: Pobierz stronę z zadaniami ---
  const tasksCollection = collection(db, "tasks");
  const tasksQuery = query(tasksCollection, where("taskListId", "==", listId));
  const tasksSnapshot = await getDocs(tasksQuery);
  const tasks = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TaskInterface[];

  if (tasks.length === 0) {
    // Jeśli nie ma zadań, zwróć je od razu z pustą tablicą etykiet
    return tasks.map((task) => ({ ...task, labels: [] }));
  }

  // --- Krok 2: Zbierz ID wszystkich pobranych zadań ---
  const taskIds = tasks.map((task) => task.id);
  // --- Krok 3: Pobierz wszystkie powiązania dla tych zadań za jednym zamachem ---
  const connectionsCollection = collection(db, "labelConnections");
  const connectionsQuery = query(connectionsCollection, where("objectId", "in", taskIds));
  const connectionsSnapshot = await getDocs(connectionsQuery);
  const connections = connectionsSnapshot.docs.map((doc) => doc.data());

  if (connections.length === 0) {
    // Jeśli nie ma powiązań, zwróć zadania z pustą tablicą etykiet
    return tasks.map((task) => ({ ...task, labels: [] }));
  }

  // --- Krok 4: Zbierz unikalne ID wszystkich potrzebnych etykiet ---
  const labelIds = [...new Set(connections.map((conn) => conn.labelId))];

  // --- Krok 5: Pobierz pełne dane wszystkich potrzebnych etykiet ---
  const labelsCollection = collection(db, "labels");
  const labelsQuery = query(labelsCollection, where("id", "in", labelIds));
  const labelsSnapshot = await getDocs(labelsQuery);
  console.log("Labels Snapshot:", labelsSnapshot);
  

  // Stwórz mapę dla łatwego i szybkiego dostępu (klucz: id etykiety, wartość: obiekt etykiety)
  const labelsMap = new Map<string, LabelInterface>(
    labelsSnapshot.docs.map((doc) => [doc.data().id, doc.data() as LabelInterface]),
  );
  console.log("Labels Map:", labelsMap);
  // --- Krok 6: Połącz wszystko w całość (Join po stronie klienta) ---
  return tasks.map((task) => {
    // Znajdź powiązania dla bieżącego zadania
    const taskConnections = connections.filter((conn) => conn.objectId === task.id);
    console.log("Task Connections:", taskConnections);
    // Na podstawie powiązańskich ID, znajdź pełne obiekty etykiet w mapie
    const taskLabels = taskConnections.map((conn) => labelsMap.get(conn.labelId)).filter(Boolean) as LabelInterface[]; // .filter(Boolean) usuwa ewentualne puste wyniki
    return {
      ...task,
      labels: taskLabels, // Dołącz gotową tablicę pełnych obiektów etykiet
    };
  });
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
