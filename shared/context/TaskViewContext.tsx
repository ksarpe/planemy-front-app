import type { TaskInterface, TaskListInterface } from "@shared/data/Tasks/interfaces";
import { useTaskLists, useTasks } from "@shared/hooks/tasks/useTasks";
import { createContext, PropsWithChildren, useMemo, useState } from "react";

interface TaskViewContextProps {
  currentTaskListId: string | null;
  setCurrentTaskListId: (id: string | null) => void;
  clickedTask: TaskInterface | null;
  setClickedTask: (task: TaskInterface | null) => void;
  // Computed values from React Query
  currentTaskList: TaskListInterface | null;
  tasks: TaskInterface[];
  isLoadingLists: boolean;
  isLoadingTasks: boolean;
  allTaskLists: TaskListInterface[];
}

const TaskViewContext = createContext<TaskViewContextProps | undefined>(undefined);
export { TaskViewContext };

export function TaskViewProvider({ children }: PropsWithChildren) {
  const [currentTaskListId, setCurrentTaskListId] = useState<string | null>(null);
  const [clickedTask, setClickedTask] = useState<TaskInterface | null>(null);
  
  // Fetch data using React Query
  const { data: taskListsData, isLoading: isLoadingLists } = useTaskLists(); //All task lists
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks(currentTaskListId!); //Tasks for current list

  // Compute current task list
  const currentTaskList = useMemo(() => {
    if (!taskListsData?.items || !currentTaskListId) return null;
    return taskListsData.items.find((list) => list.id === currentTaskListId) || null;
  }, [taskListsData, currentTaskListId]);

  // Ensure tasks is always an array
  const tasks = useMemo(() => {
    return Array.isArray(tasksData) ? tasksData : [];
  }, [tasksData]);

  const value = {
    currentTaskListId,
    setCurrentTaskListId,
    clickedTask,
    setClickedTask,
    currentTaskList,
    tasks,
    isLoadingLists,
    isLoadingTasks,
    allTaskLists: taskListsData?.items || [],
  };

  return <TaskViewContext.Provider value={value}>{children}</TaskViewContext.Provider>;
}
