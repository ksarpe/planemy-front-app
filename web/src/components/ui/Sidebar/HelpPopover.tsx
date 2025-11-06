import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover";
import { Book, ExternalLink, Mail } from "lucide-react";
import { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";

interface HelpPopoverProps {
  collapsed: boolean;
}

export function HelpPopover({ collapsed }: HelpPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={`p-4 rounded-2xl active:scale-95 hover:bg-bg ${collapsed ? "flex items-center justify-center" : ""} cursor-pointer`}
          onClick={() => setIsOpen(true)}
          title="Help">
          <FiHelpCircle size={20} />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 border-border shadow-lg"
        side={collapsed ? "right" : "top"}
        align="start"
        sideOffset={8}
        onMouseLeave={() => setIsOpen(false)}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-text">Planemy Help</h4>
            <p className="text-xs text-text-muted">Your productivity companion</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Quick Links */}
          <div className="space-y-2">
            <a
              href="/docs"
              className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-bg-hover transition-colors group">
              <Book size={16} className="text-text-muted group-hover:text-primary" />
              <span className="text-xs text-text-muted group-hover:text-text">Documentation</span>
              <ExternalLink size={12} className="ml-auto text-text-muted opacity-0 group-hover:opacity-100" />
            </a>
            <a
              href="mailto:support@planemy.com"
              className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-bg-hover transition-colors group">
              <Mail size={16} className="text-text-muted group-hover:text-primary" />
              <span className="text-xs text-text-muted group-hover:text-text">Contact Support</span>
            </a>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted">Version</span>
            <span className="text-text font-medium">1.0.0</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
