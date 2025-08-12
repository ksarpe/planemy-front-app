import { LucideIcon } from "lucide-react";

export type SidebarLinkProps = {
  to: string;
  icon: LucideIcon;
  label: string;
  onNavigate?: () => void;
};
