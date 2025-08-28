import type { LabelInterface } from "@/data/Utils/interfaces";
import type { Announcement, UserNotificationStatus } from "@/data/Utils/interfaces";

// Utility component interfaces (moved from components/ui/Utils/, Tags/, Sidebar/, User/, Announcements/)

// Utils components
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface EditableTextProps {
  value: string; //taskTitle from taskDetails
  onSave: (newValue: string) => void; //taskTitle change handler
  className?: string;
  placeholder?: string;
}

export interface InlineAddInputProps {
  onSubmit: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
  classNames?: string;
}

export interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
  duration?: number;
}

// Tags/Labels components
export interface AddLabelTileProps {
  onClick: () => void;
  loading: boolean;
}

export interface EmptyLabelsStateProps {
  onCreateFirst: () => void;
}

export interface LabelCardProps {
  label: LabelInterface;
  onEdit: (label: LabelInterface) => void;
  onDelete: (labelId: string) => void;
}

export interface LabelFormProps {
  mode: "create" | "edit";
  initialLabel?: LabelInterface;
  onSubmit: (data: { name: string; color: string; description?: string }, labelId?: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export interface LabelsGridProps {
  labels: LabelInterface[];
  onEdit: (label: LabelInterface) => void;
  onDelete: (labelId: string) => void;
  onCreateNew: () => void;
  loading: boolean;
}

// Sidebar components
export interface SidebarNavProps {
  handleNavigate: () => void;
  linkPadding: string;
  labelHiddenClass: string;
  iconSize: number;
  totalNotifications: number;
  collapsed?: boolean;
}

export interface SidebarUserSectionProps {
  collapsed: boolean;
  user: { displayName?: string | null; email?: string | null } | null;
  handleNavigate: () => void;
  handleLogout: () => void;
}

// User components
export interface SaveBarProps {
  visible: boolean;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
  ping?: number; // increment to trigger attention animation
}

// Announcements components  
export interface AnnouncementCardProps {
  announcement: Announcement & {
    userStatus?: UserNotificationStatus;
    isNew?: boolean;
    isRead?: boolean;
  };
}