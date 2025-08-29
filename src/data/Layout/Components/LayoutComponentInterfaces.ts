// Layout feature component interfaces

export interface SidebarUserSectionProps {
  collapsed: boolean;
  user: { displayName?: string | null; email?: string | null } | null;
  handleNavigate: () => void;
  handleLogout: () => void;
}

export interface SidebarNavProps {
  handleNavigate: () => void;
  linkPadding: string;
  labelHiddenClass: string;
  iconSize: number;
  totalNotifications: number;
  collapsed?: boolean;
}