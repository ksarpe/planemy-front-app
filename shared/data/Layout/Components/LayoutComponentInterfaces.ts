// Layout feature component interfaces

import { User } from "firebase/auth";

export interface SidebarUserSectionProps {
  collapsed: boolean;
  handleNavigate: () => void;
}

export interface SidebarNavProps {
  handleNavigate: () => void;
  totalNotifications: number;
  collapsed?: boolean;
}
