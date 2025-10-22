import { Lock } from "lucide-react";
import { useT } from "@shared/hooks/utils/useT";

export default function SecuritySection() {
  const { t } = useT();

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 ">
      <h3 className="text-lg font-semibold text-gray-900  mb-6 flex items-center gap-2">
        <Lock size={20} className="text-primary" />
        {t("security.title")}
      </h3>
      <div className="flex gap-4 items-center">
        <button className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          {t("security.changePassword")}
        </button>
        <button className="w-full md:w-auto px-4 py-2 border border-gray-300  text-gray-700  rounded-lg hover:bg-gray-50  transition-colors">
          {t("security.setup2FA")}
        </button>
        <button className="w-full md:w-auto px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          {t("security.deleteAccount")}
        </button>
      </div>
    </div>
  );
}
