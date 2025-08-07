import { Calendar } from "lucide-react";

interface Task {
  id: number;
  title: string;
  time: string;
  priority: "high" | "medium" | "low";
}

interface TodayScheduleProps {
  tasks: Task[];
}

export default function TodaySchedule({ tasks }: TodayScheduleProps) {
  return (
    <div className="bg-bg-alt dark:bg-bg-item-dark rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text dark:text-text-dark flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Dzisiejszy harmonogram
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          Zobacz wszystkie
        </button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center p-3 bg-bg dark:bg-bg-dark rounded-lg">
            <div
              className={`w-3 h-3 rounded-full mr-3 ${
                task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
              }`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text dark:text-text-dark">{task.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{task.time}</p>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {task.priority === "high" ? "Wysoki" : task.priority === "medium" ? "Średni" : "Niski"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
