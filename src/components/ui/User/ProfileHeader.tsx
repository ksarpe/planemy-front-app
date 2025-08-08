import { Camera, Edit3 } from "lucide-react";
import type { ProfileHeaderProps } from "@/data/User";

export default function ProfileHeader({ userInfo }: ProfileHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
            {userInfo.firstName[0]}
            {userInfo.lastName[0]}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {userInfo.firstName} {userInfo.lastName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{userInfo.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.bio}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors">
          <Edit3 size={16} />
          Edytuj
        </button>
      </div>
    </div>
  );
}
