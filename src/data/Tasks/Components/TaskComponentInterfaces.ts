// Tasks feature component interfaces

import type { TaskListInterface } from "../interfaces";

export interface TaskListPanelProps {
  lists: TaskListInterface[];
  currentList: TaskListInterface | null;
  onSelectList: (list: TaskListInterface) => void;
  onAddList: () => void;
}