import { Drawer } from "@/components/ui/Common/Drawer";
import type { TaskListInterface } from "@shared/data/Tasks/interfaces";
import { TaskListPanel } from "./TaskListPanel";

interface TaskListsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allTaskLists: TaskListInterface[];
  currentTaskList: TaskListInterface | null;
  onSelectList: (list: TaskListInterface) => void;
  onAddList: () => void;
}

export function TaskListsDrawer({
  isOpen,
  onClose,
  allTaskLists,
  currentTaskList,
  onSelectList,
  onAddList,
}: TaskListsDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} width="sm" position="right">
      <TaskListPanel
        lists={allTaskLists}
        currentList={currentTaskList}
        onSelectList={onSelectList}
        onAddList={onAddList}
      />
    </Drawer>
  );
}
