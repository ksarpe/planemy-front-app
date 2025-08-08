import { Activity } from "lucide-react";

interface ActivityItem {
  id: number;
  action: string;
  item: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-bg-alt  rounded-lg p-6 border border-gray-200 ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text  flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" />
          Ostatnie aktywności
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-800  ">Zobacz wszystkie</button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start p-3 bg-bg  rounded-lg">
            <div className="w-2 h-2 rounded-full bg-success mt-2 mr-3 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text ">{activity.action}</p>
              <p className="text-xs text-gray-600 ">{activity.item}</p>
              <p className="text-xs text-gray-500  mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
