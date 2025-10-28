import type { PersonalInformationSectionProps } from "@shared/data/User";
import { useT } from "@shared/hooks/utils/useT";
import { Mail } from "lucide-react";

export default function PersonalInformationSection({
  userInfo,
  handleUserInfoChange,
}: PersonalInformationSectionProps) {
  const { t } = useT();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-text mb-2">{t("personalInformation.nickname")}</label>
          <input
            type="text"
            value={userInfo.nickname || userInfo.username || ""}
            onChange={(e) =>
              handleUserInfoChange(userInfo.nickname !== undefined ? "nickname" : "username", e.target.value)
            }
            className="w-full px-3 py-2 border border-bg-muted-light rounded-lg bg-bg-alt text-text focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            placeholder={t("personalInformation.nicknamePlaceholder")}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-text mb-2">
            <Mail size={16} />
            {t("personalInformation.email")}
          </label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => handleUserInfoChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-bg-muted-light rounded-lg bg-bg-alt text-text focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>
    </div>
  );
}
