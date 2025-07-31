import React, { useState, useRef, useEffect } from "react";
import { BasicDropdownProps, BasicDropdownItemProps } from "@/data/Common/interfaces";

export const BasicDropdown: React.FC<BasicDropdownProps> = ({
  trigger,
  children,
  align = "right",
  width = "w-64",
  closeOnItemClick = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = () => {
    if (closeOnItemClick) {
      setIsOpen(false);
    }
  };

  // Clone children and add onClick handler if closeOnItemClick is true
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === BasicDropdownItem) {
      const childProps = child.props as BasicDropdownItemProps;
      return React.cloneElement(child as React.ReactElement<BasicDropdownItemProps>, {
        onClick: () => {
          childProps.onClick?.();
          handleItemClick();
        },
      });
    }
    return child;
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className={`absolute top-full mt-2 ${width} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 ${
              align === "left" ? "left-0" : "right-0"
            }`}>
            <div className="p-2">{childrenWithProps}</div>
          </div>

          {/* Background overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
        </>
      )}
    </div>
  );
};

export const BasicDropdownItem: React.FC<BasicDropdownItemProps> = ({
  icon: Icon,
  iconSize = 16,
  iconColor,
  children,
  onClick,
  disabled = false,
  variant = "default",
  className = "",
  separator = false,
}) => {
  const variantStyles = {
    default: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
    blue: "text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30",
    orange: "text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30",
    red: "text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30",
    green: "text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30",
  };

  const baseClasses = `w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors text-sm ${
    disabled ? "opacity-50 cursor-not-allowed" : `cursor-pointer ${variantStyles[variant]}`
  } ${separator ? "mt-2 border-t border-gray-100 dark:border-gray-600 pt-3" : ""} ${className}`;

  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} className={baseClasses}>
      {Icon && <Icon size={iconSize} className={iconColor || undefined} />}
      {children}
    </button>
  );
};

export default BasicDropdown;
