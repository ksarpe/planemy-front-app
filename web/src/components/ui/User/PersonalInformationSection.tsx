import type { PersonalInformationSectionProps } from "@shared/data/User";
import { useT } from "@shared/hooks/utils/useT";
import { Mail, User } from "lucide-react";

export default function PersonalInformationSection({
  userInfo,
  handleUserInfoChange,
}: PersonalInformationSectionProps) {
  const { t } = useT();

  return (
    <div className="bg-white  rounded-lg p-6 border border-gray-200 ">
      <h3 className="text-lg font-semibold text-gray-900  mb-6 flex items-center gap-2">
        <User size={20} className="text-primary" />
        {t("personalInformation.title")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-2">{t("personalInformation.nickname")}</label>
          <input
            type="text"
            value={userInfo.nickname || userInfo.username || ""}
            onChange={(e) =>
              handleUserInfoChange(userInfo.nickname !== undefined ? "nickname" : "username", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder={t("personalInformation.nicknamePlaceholder")}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700  mb-2">
            <Mail size={16} />
            {t("personalInformation.email")}
          </label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => handleUserInfoChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300  rounded-lg bg-white  text-gray-900  focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
