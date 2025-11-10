// Utils feature component interfaces

import type { Announcement, LabelInterface, UserNotificationStatus } from "../interfaces";

export interface ToastProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
  duration?: number;
}

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

export interface AnnouncementCardProps {
  announcement: Announcement & {
    userStatus?: UserNotificationStatus;
    isNew?: boolean;
    isRead?: boolean;
  };
}

// Tags/Labels component interfaces
export interface LabelCardProps {
  label: LabelInterface;
  onEdit: (label: LabelInterface) => void;
  onDelete: (labelId: string) => void;
}

export interface LabelsGridProps {
  labels: LabelInterface[];
  onEdit: (label: LabelInterface) => void;
  onDelete: (labelId: string) => void;
  onCreateNew: () => void;
  loading: boolean;
}

export interface EmptyLabelsStateProps {
  onCreateFirst: () => void;
}
