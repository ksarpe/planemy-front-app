import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface QuickStatsProps {
  stats: StatItem[];
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-xl bg-bg-alt border border-border shadow-md shadow-shadow transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-text">{stat.value}</p>
            </div>
            <stat.icon className={`w-10 h-10 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
