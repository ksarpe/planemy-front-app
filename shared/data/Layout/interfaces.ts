import { LucideIcon } from "lucide-react";

// Layout and navigation related interfaces

export interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  onNavigate?: () => void;
}
