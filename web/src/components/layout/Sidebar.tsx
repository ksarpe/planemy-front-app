//import { usePendingShares } from "@shared/hooks/permissions/usePermissions";
import { useEffect, useState } from "react";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { SettingsModal } from "../ui/Modals";
import { DarkModeToggle } from "../ui/Sidebar/DarkModeToggle";
import { SidebarNav } from "../ui/Sidebar/SidebarNav";
import SidebarSettings from "../ui/Sidebar/SidebarSettings";
import { SidebarUserSection } from "../ui/Sidebar/SidebarUserSection";

export default function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  //TODO: counts (lightweight; consider optimization later)
  //const { data: taskListShares = [] } = usePendingShares("task_list");
  //const { data: shoppingListShares = [] } = usePendingShares("shopping_list");
  // something for getting global notifications
  //const totalNotifications = taskListShares.length + shoppingListShares.length;
  const [collapsed, setCollapsed] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
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
        className={`p-4 fixed inset-y-0 left-0 z-30 ${widthClasses} h-full transform transition-all duration-300 bg-bg-alt md:static flex flex-col justify-between p-2 ${
          isOpen ? " translate-x-0" : " -translate-x-full md:translate-x-0"
        }`}>
        {/* LOGO */}
        <NavLink to="/">
          <img src={collapsed ? `minilogo.png` : `logo.png`} alt="Logo" className={collapsed ? `h-12` : `h-16`} />
        </NavLink>

        {/* NAVIGATION / PERSONAL / UTILS */}
        <div className="flex flex-col flex-1 mt-4">
          <SidebarNav
            handleNavigate={onClose || (() => {})}
            //totalNotifications={totalNotifications}
            totalNotifications={0}
            collapsed={collapsed}
          />
        </div>
        <div className="w-full h-px bg-text-muted/20 my-1" />

        {/* SETTINGS */}
        <SidebarSettings collapsed={collapsed} onSettingsClick={() => setIsSettingsModalOpen(true)} />
        <div className="w-full h-px bg-text-muted/20 my-1" />
        {/* USER INFO */}
        <SidebarUserSection collapsed={collapsed} onSettingsClick={() => setIsSettingsModalOpen(true)} />

        <div className="w-full h-px bg-text-muted/20 mb-4 mt-1" />
        {/* Collapse button + Dark Mode */}
        <div
          className={`hidden md:flex ${
            collapsed ? "flex-col items-center gap-3" : "flex-row items-center justify-between"
          }`}>
          <DarkModeToggle collapsed={collapsed} />
          <button
            aria-label={collapsed ? "Rozwiń sidebar" : "Zwiń sidebar"}
            className="flex items-center rounded-2xl cursor-pointer text-primary"
            onClick={() => setCollapsed((c) => !c)}>
            <span className="hover:bg-bg rounded-2xl px-1 transition-colors">
              {collapsed ? <FiChevronsRight size={24} /> : <FiChevronsLeft size={24} />}
            </span>
          </button>
        </div>
      </aside>
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  );
}
