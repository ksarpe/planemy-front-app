import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { BasicDropdownProps, BasicDropdownItemProps } from "@shared/data/Common/interfaces";

export const BasicDropdown: React.FC<BasicDropdownProps> = ({
  trigger,
  children,
  Xalign = "right",
  Yalign = "bottom",
  width = "w-64",
  closeOnItemClick = true,
  className = "",
  usePortal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePosition = () => {
      if (!triggerRef.current || !usePortal) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const dropdownHeight = dropdownRef.current?.offsetHeight || 0;
      const dropdownWidth = dropdownRef.current?.offsetWidth || 0;

      // Calculate vertical position
      let top = triggerRect.bottom + scrollTop + 8; // 8px gap below
      if (Yalign === "top") {
        top = triggerRect.top + scrollTop - dropdownHeight - 8; // 8px gap above
      }

      // Calculate horizontal position
      let left = triggerRect.left + scrollLeft;
      if (Xalign === "right") {
        left = triggerRect.right + scrollLeft - dropdownWidth;
      }

      setPosition({ top, left });
    };

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

    const handleScroll = () => {
      if (isOpen && usePortal) {
        calculatePosition();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      if (usePortal) {
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);
        calculatePosition();
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      if (usePortal) {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      }
    };
  }, [isOpen, usePortal, Xalign, Yalign]);

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

  const renderDropdown = () => {
    if (!isOpen) return null;

    // Calculate positioning classes for non-portal mode
    const getPositionClasses = () => {
      if (usePortal) return "fixed";

      const verticalClass = Yalign === "top" ? "bottom-full mb-2" : "top-full mt-2";
      const horizontalClass = Xalign === "left" ? "left-0" : "right-0";

      return `absolute ${verticalClass} ${horizontalClass}`;
    };

    const dropdownContent = (
      <>
        <div
          ref={dropdownRef}
          className={`${getPositionClasses()} ${width} bg-white border border-gray-200 rounded-md shadow-lg z-50`}
          style={usePortal ? { top: position.top, left: position.left } : {}}>
          <div className="p-2">{childrenWithProps}</div>
        </div>

        {/* Background overlay */}
        <div className={`${usePortal ? "fixed" : "fixed"} inset-0 z-40`} onClick={() => setIsOpen(false)}></div>
      </>
    );

    return usePortal ? createPortal(dropdownContent, document.body) : dropdownContent;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {renderDropdown()}
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
}) => {
  const variantStyles = {
    default: "text-gray-700  hover:bg-gray-50 ",
    blue: "text-blue-700  hover:bg-blue-50 ",
    orange: "text-orange-700  hover:bg-orange-50 ",
    red: "text-red-700  hover:bg-red-50 ",
    green: "text-green-700  hover:bg-green-50 ",
  };

  const baseClasses = `w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors text-sm ${
    disabled ? "opacity-50 cursor-not-allowed" : `cursor-pointer ${variantStyles[variant]}`
  }  ${className}`;

  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} className={baseClasses}>
      {Icon && <Icon size={iconSize} className={iconColor || undefined} />}
      {children}
    </button>
  );
};

export default BasicDropdown;
