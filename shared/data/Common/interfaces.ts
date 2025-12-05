import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { ActionButtonColor, ActionButtonSize, BasicDropdownItemVariantColor } from "./types";

// Basic Dropdown
export interface BasicDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  Xalign?: "left" | "right";
  Yalign?: "top" | "bottom";
  width?: string;
  closeOnItemClick?: boolean;
  className?: string;
  usePortal?: boolean;
}

export interface BasicDropdownItemProps {
  icon?: LucideIcon;
  iconSize?: number;
  iconColor?: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: BasicDropdownItemVariantColor;
  className?: string;
  separator?: boolean;
}

// Action Button
export interface ActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  iconSize?: number;
  text: string;
  color: ActionButtonColor;
  size: ActionButtonSize;
  disabled?: boolean;
  className?: string;
  justIcon?: boolean; // If true, button will only show the icon without text
}

// Base Modal
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showCloseButton?: boolean;
  maxWidth?: string;
  actions?: ReactNode;
}

//Modals
export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  additionalInfo?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

export interface InputModalInput {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number" | "date";
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  autoFocus?: boolean;
  helperText?: string;
}

export interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  title: string;
  inputs: InputModalInput[];
  submitButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  maxWidth?: string;
}

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval?: number;
  bymonthday?: number;
  byweekday?: number[];
  count?: number;
  until?: string;
  weekStart?: number;
}
