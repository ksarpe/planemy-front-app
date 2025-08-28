import type { TaskListInterface } from "@/data/Tasks/interfaces";

// Tasks component interfaces (moved from components/ui/Tasks/)

export interface TaskListPanelProps {
  lists: TaskListInterface[];
  currentList: TaskListInterface | null;
  onSelectList: (list: TaskListInterface) => void;
  onAddList: () => void;
}