import { TrendingUp } from "lucide-react";

interface WeeklyProgressProps {
  progress: number;
}

export default function WeeklyProgress({ progress }: WeeklyProgressProps) {
  return (
    <div className="bg-bg-alt dark:bg-bg-item-dark rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text dark:text-text-dark flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
          Postęp tygodnia
        </h2>
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
              className="text-success"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-text dark:text-text-dark">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ukończono zadania w tym tygodniu</p>
        <p className="text-xs text-success font-medium">Świetny postęp! Zostało tylko 3 zadania</p>
      </div>
    </div>
  );
}
