import type { AdditionalDataInterface } from "@/data/types";
import { Baby } from "lucide-react";

interface AdditionalDataProps {
  additionalData: AdditionalDataInterface | null;
}

export default function AdditionalData({ additionalData }: AdditionalDataProps) {
  if (!additionalData) return null;

  return (
    <div>
      {additionalData.isPeriod ? (
        <div className="text-sm text-gray-400 italic flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-4 h-4 text-red-500"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C12 2 5 9 5 14a7 7 0 0014 0c0-5-7-12-7-12z" />
          </svg>
          Period warning!
        </div>
      ) : null}
      {additionalData.isOvulation ? (
        <div className="text-sm text-gray-400 italic mt-4 flex flex-row items-center">
          <Baby size={20} className="text-yellow-500" />
          Baby jackpot!
        </div>
      ) : null}
    </div>
  );
}
