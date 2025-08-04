import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { BasicDropdownItemVariantColor, ActionButtonColor, ActionButtonSize } from "./types";

// Basic Dropdown
export interface BasicDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
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

// AI Textbox
export interface AITextboxProps {
  placeholder?: string[];
  disabled?: boolean;
  className?: string;
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
  centered?: boolean;
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

export interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  title: string;
  currentName: string;
  placeholder?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  validateName?: (name: string) => boolean;
}
