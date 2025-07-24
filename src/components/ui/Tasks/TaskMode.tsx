import TaskItem from "@/components/ui/Tasks/TaskItem";
import InlineAddInput from "@/components/ui/Utils/InlineAddInput";
import { useTaskContext } from "@/context/TaskContext";
import { useState } from "react";

export default function TaskMode() {
  const { tasks, addTask } = useTaskContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  return (
    //Task mode container
    <div className="p-4 space-y-3">
      {/* Tasks list */}
      <div className="space-y-3">
        <h1>Zadania:</h1>
        <ul className="space-y-2">
          {tasks
            .filter((task) => !task.completed)
            .map((task, idx) => (
              <TaskItem task={task} key={idx} />
            ))}
        </ul>
      </div>
      {isAddingTask ? (
        <InlineAddInput
          onSubmit={async (value) => {
            await addTask(value);
            setIsAddingTask(false);
          }}
          onCancel={() => setIsAddingTask(false)}
          placeholder="Enter task name..."
          classNames="bg-white p-2 shadow rounded-lg"
        />
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="rounded-lg bg-primary h-10 w-10 text-2xl cursor-pointer hover:opacity-90">
          +
        </button>
      )}
      <div className="space-y-3">
        {tasks.filter(task => task.completed).length > 0 && <h1>Completed tasks:</h1>}
        <ul className="space-y-2">
          {tasks
            .filter((task) => task.completed)
            .map((task, idx) => (
              <TaskItem task={task} key={idx} />
            ))}
        </ul>
      </div>
    </div>
  );
}
