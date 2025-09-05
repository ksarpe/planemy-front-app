// Utils feature component interfaces

import type { LabelInterface, Announcement, UserNotificationStatus } from "../interfaces";

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

export interface InlineAddInputProps {
  onSubmit: (value: string) => void;
  onCancel: () => void;
  placeholder?: string;
  classNames?: string;
}

export interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: "text" | "number" | "date";
  suffix?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  displayValue?: string; // Optional display value different from edit value
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
export interface AddLabelTileProps {
  onClick: () => void;
  loading: boolean;
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

export interface EmptyLabelsStateProps {
  onCreateFirst: () => void;
}