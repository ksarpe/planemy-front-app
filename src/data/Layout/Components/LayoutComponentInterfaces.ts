// Layout feature component interfaces

import { User } from "firebase/auth";

export interface SidebarUserSectionProps {
  collapsed: boolean;
  user: User | null;
  handleNavigate: () => void;
  handleLogout: () => void;
}

export interface SidebarNavProps {
  handleNavigate: () => void;
  totalNotifications: number;
  collapsed?: boolean;
}
