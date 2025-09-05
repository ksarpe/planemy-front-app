// Common UI component interfaces for Shopping feature

export interface CategoryEmojiProps {
  category: string;
}

export interface QtyStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disabledDecrease?: boolean;
  size?: "sm" | "md";
}
