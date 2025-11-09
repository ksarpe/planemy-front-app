import type { SidebarNavProps } from "@shared/data/Layout/Components/LayoutComponentInterfaces";
import { useT } from "@shared/hooks/utils/useT";
import { FaRegFaceGrimace } from "react-icons/fa6";
import { FiCalendar, FiDollarSign, FiHome, FiList, FiTag, FiTrendingUp } from "react-icons/fi";
import { SidebarNavLink } from "./SidebarNavLink";

export type { SidebarNavProps } from "@shared/data/Layout/Components/LayoutComponentInterfaces";

export function SidebarNav({ handleNavigate, collapsed = false }: SidebarNavProps) {
  const { t } = useT();

  const navigationItems = [
    { to: "/", label: t("sidebar.dashboard"), Icon: FiHome },
    { to: "/calendar", label: t("sidebar.calendar"), Icon: FiCalendar },
    { to: "/tasks", label: t("sidebar.tasks"), Icon: FiList },
    //{ to: "/shopping", label: t("sidebar.shopping"), Icon: FiShoppingBag },
    { to: "/payments", label: t("sidebar.payments"), Icon: FiDollarSign },
  ];
  const personalItems = [
    { to: "/buddy", label: "Buddy", Icon: FaRegFaceGrimace },
    { to: "/development", label: t("sidebar.development"), Icon: FiTrendingUp },
  ];
  const utilsItems = [
    { to: "/labels", label: t("sidebar.labels"), Icon: FiTag },
    //{ to: "/feedback", label: t("sidebar.feedback"), Icon: FiBookOpen },
  ];

  if (collapsed) {
    return (
      <nav className="flex flex-col">
        <div className="flex flex-col items-center gap-1">
          {navigationItems.map(({ to, Icon, label }) => (
            <SidebarNavLink key={to} to={to} label={label} Icon={Icon} onClick={handleNavigate} collapsed={true} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          {personalItems.map(({ to, Icon, label }) => (
            <SidebarNavLink key={to} to={to} label={label} Icon={Icon} onClick={handleNavigate} collapsed={true} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-1">
          {utilsItems.map(({ to, Icon, label }) => (
            <SidebarNavLink key={to} to={to} label={label} Icon={Icon} onClick={handleNavigate} collapsed={true} />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-text-muted">NAVIGATION</span>

        {navigationItems.map(({ to, Icon, label }) => (
          <SidebarNavLink key={to} to={to} label={label} Icon={Icon} onClick={handleNavigate} collapsed={false} />
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-text-muted">PERSONAL</span>

        {personalItems.map(({ to, Icon, label }) => (
          <SidebarNavLink key={to} to={to} label={label} Icon={Icon} onClick={handleNavigate} collapsed={false} />
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-text-muted">UTILS</span>

        {utilsItems.map(({ to, Icon, label }) => (
          <SidebarNavLink key={to} to={to} label={label} Icon={Icon} onClick={handleNavigate} collapsed={false} />
        ))}
      </div>
    </nav>
  );
}
