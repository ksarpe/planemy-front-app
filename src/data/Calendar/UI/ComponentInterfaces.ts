import type { EventInterface } from "@/data/Calendar/events";

// Calendar component interfaces (moved from components/ui/Calendar/)

export interface EventBlockProps {
  event: EventInterface;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
}

export interface EventDetailsModalProps {
  event: EventInterface;
  onClose: () => void;
  onEdit: (elementPosition: { x: number; y: number }) => void;
  elementPosition: { x: number; y: number };
}

export interface EventEditModalProps {
  event: EventInterface;
  onClose: () => void;
  onSave: (updatedEvent: EventInterface) => void;
  elementPosition: { x: number; y: number };
}

export interface QuickEventCreatorProps {
  selectedDate?: Date;
  onClose?: () => void;
  onPreviewChange?: (previewData: Partial<EventInterface>) => void;
  className?: string;
}

export interface CalendarBodyProps {
  className?: string;
}

export interface PreviewEventBlockInlineProps {
  event: Partial<EventInterface>;
  showTime?: boolean;
  className?: string;
}