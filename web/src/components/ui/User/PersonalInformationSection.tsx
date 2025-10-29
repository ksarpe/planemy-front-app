import type { PersonalInformationSectionProps } from "@shared/data/User";
import { useT } from "@shared/hooks/utils/useT";
import { FloatingLabelInput } from "../Common";

export default function PersonalInformationSection({
  userInfo,
  handleUserInfoChange,
}: PersonalInformationSectionProps) {
  const { t } = useT();

  return (
    <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <FloatingLabelInput
        label={t("personalInformation.nickname")}
        id="nickname"
        value={userInfo.username || ""}
        onChange={(e) => handleUserInfoChange("username", e.target.value)}
      />
      <FloatingLabelInput
        label={t("personalInformation.email")}
        id="email"
        value={userInfo.email || ""}
        onChange={(e) => handleUserInfoChange("email", e.target.value)}
        autoFocus={false}
      />
    </div>
  );
}
