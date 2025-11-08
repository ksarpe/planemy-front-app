import type { PersonalInformationSectionProps } from "@shared/data/User";
import { Input } from "../shadcn/input";

export default function PersonalInformationSection({
  userInfo,
  handleUserInfoChange,
}: PersonalInformationSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        id="nickname"
        placeholder="Your nickname"
        value={userInfo.username || ""}
        onChange={(e) => handleUserInfoChange("username", e.target.value)}
      />
      <Input
        id="id"
        placeholder="Your email"
        value={userInfo.email || ""}
        onChange={(e) => handleUserInfoChange("email", e.target.value)}
      />
    </div>
  );
}
