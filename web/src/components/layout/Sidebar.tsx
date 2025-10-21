//import { usePendingShares } from "@shared/hooks/permissions/usePermissions";
import { useState, useEffect } from "react";
import { SidebarNav } from "../ui/Sidebar/SidebarNav";
import { SidebarUserSection } from "../ui/Sidebar/SidebarUserSection";
import { DarkModeToggle } from "../ui/Sidebar/DarkModeToggle";
import { NavLink } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SidebarSettings from "../ui/Sidebar/SidebarSettings";

export default function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  //TODO: counts (lightweight; consider optimization later)
  //const { data: taskListShares = [] } = usePendingShares("task_list");
  //const { data: shoppingListShares = [] } = usePendingShares("shopping_list");
  // something for getting global notifications
  //const totalNotifications = taskListShares.length + shoppingListShares.length;
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("app_sidebar_collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("app_sidebar_collapsed", collapsed ? "true" : "false");
  }, [collapsed]);
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) setCollapsed(false);
  }, [isOpen]);

  const widthClasses = collapsed ? "w-[84px]" : "w-58"; //

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 md:hidden z-40" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`p-4 fixed inset-y-0 left-0 z-50 ${widthClasses} h-full transform transition-all duration-300 bg-bg md:static flex flex-col justify-between p-2 ${
          isOpen ? " translate-x-0" : " -translate-x-full md:translate-x-0"
        }`}>
        {/* Collapse button */}
        <button
          aria-label={collapsed ? "Rozwiń sidebar" : "Zwiń sidebar"}
          className="hidden md:flex absolute -right-2 top-8 items-center justify-center rounded-md cursor-pointer text-primary"
          onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
        </button>

        {/* LOGO */}
        <NavLink to="/">
          <img src={collapsed ? `minilogo.png` : `logo.png`} alt="Logo" className={collapsed ? `h-12` : `h-16`} />
        </NavLink>

        {/* NAVIGATION / PERSONAL / UTILS */}
        <div className="flex flex-col gap-4 flex-1 overflow-hidden mt-8">
          <SidebarNav
            handleNavigate={onClose || (() => {})}
            //totalNotifications={totalNotifications}
            totalNotifications={0}
            collapsed={collapsed}
          />
        </div>
        <div className="w-full h-px bg-text-muted/20 my-2" />

        {/* SETTINGS + DARK MODE */}
        <div
          className={`my-1 flex ${collapsed ? "justify-center flex-col gap-4 mt-4" : "justify-between"} items-center`}>
          <SidebarSettings collapsed={collapsed} />
          <DarkModeToggle collapsed={collapsed} />
        </div>
        <div className="w-full h-px bg-text-muted/20 my-2" />

        {/* USER INFO */}
        <SidebarUserSection
          collapsed={collapsed}
          handleNavigate={onClose || (() => {})}
        />
      </aside>
    </>
  );
}
