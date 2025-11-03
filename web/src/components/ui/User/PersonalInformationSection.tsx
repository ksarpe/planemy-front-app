import type { PersonalInformationSectionProps } from "@shared/data/User";
import { Input } from "../shadcn/input";

export default function PersonalInformationSection({
  userInfo,
  handleUserInfoChange,
}: PersonalInformationSectionProps) {

  return (
    <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        id="nickname"
        value={userInfo.username || ""}
        onChange={(e) => handleUserInfoChange("username", e.target.value)}
      />
      <Input
        id="email"
        value={userInfo.email || ""}
        onChange={(e) => handleUserInfoChange("email", e.target.value)}
        autoFocus={false}
      />
    </div>
  );
}
