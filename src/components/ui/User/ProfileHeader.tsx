import { Camera, Edit3 } from "lucide-react";
import type { ProfileHeaderProps } from "@/data/User";

export default function ProfileHeader({ userInfo }: ProfileHeaderProps) {
  return (
    <div className="bg-white  rounded-lg p-6 border border-gray-200 ">
      <div className="flex items-center gap-6">
        {/* Avatar with stable size to avoid flicker */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-semibold">
            {userInfo.nickname?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
            <Camera size={14} />
          </button>
        </div>

        {/* Basic info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900  truncate">{userInfo.nickname}</h2>
          <p className="text-sm text-gray-600  truncate">{userInfo.email}</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors">
          <Edit3 size={16} />
          Edytuj
        </button>
      </div>
    </div>
  );
}
