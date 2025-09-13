import type { TaskListFilter, SharedUserStatus, EmptyListType } from "./types";
import type { SharePermission } from "@shared/data/Utils/types";
import type { LabelInterface } from "@shared/data/Utils/interfaces";
import { LucideIcon } from "lucide-react";

export interface TaskInterface {
  id: string;
  title: string;
  description?: string; // Optional textarea
  dueDate?: string; // Optional datetime
  isCompleted: boolean;
  userId: string; // Creator of the task
  taskListId: string; // Foreign key to TaskList
  sharedBy?: string; // ID of user who originally created the task (for shared lists)
  createdAt?: string;
  updatedAt?: string;

  //optional for frontend purposes
  labels?: LabelInterface[]; // Optional array of labels for the task
}

export interface TaskListInterface {
  id: string;
  name: string;
  userId: string; // Owner of the list
  createdAt?: string;
  updatedAt?: string;

  //frontend purpose
  shared?: boolean; // Indicates if the list is shared
  labels?: LabelInterface[]; // Optional array of labels for the list
  totalTasks?: number;
}

export interface TaskListsResponse {
  items: TaskListInterface[];
  limit: number;
  offset: number;
  total: number;
}

// export interface QuickTaskInterface {
//   id: number;
//   title: string;
// }

export interface SharedTaskList {
  id?: string; // For invitation documents
  listId: string;
  sharedBy: string; // user ID who shared
  permission: SharePermission;
  sharedAt: string;
  acceptedAt?: string;
}

//Create
export interface CreateTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface QuickAddTaskProps {
  //quick add
  onCancel: () => void;
}

//Sharing
export interface SharedUser {
  id: string;
  email: string;
  displayName?: string;
  permission: SharePermission;
  status: SharedUserStatus;
}

export interface ManageTaskListSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
}

//overall
export interface EmptyStatesProps {
  type: EmptyListType;
  onCreateListClick: () => void;
}

export interface TaskListInfo {
  name: string;
  tasksCount: number;
}

export interface TaskAlertsProps {
  tasks: TaskInterface[];
}

export interface TaskItemProps {
  task: TaskInterface;
}

export interface TaskListProps {
  filter: TaskListFilter;
  tasks: TaskInterface[]; // Optional tasks prop for filtering
  isLoading?: boolean; // Loading state for fetching tasks
}

export interface TaskProgressIndicatorProps {
  completedTasksLength: number;
  pendingTasksLength: number;
}

export interface TaskStatisticsProps {
  filter: TaskListFilter;
  onFilterChange: (filter: TaskListFilter) => void;
  tasks: TaskInterface[];
}

export interface TaskViewHeaderProps {
  onToggleLists?: () => void;
  listsOpen?: boolean;
}

export interface StatisticCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string;
  isSelected: boolean;
  onClick: () => void;
}
