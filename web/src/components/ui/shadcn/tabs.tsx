import { Tabs as TabsPrimitive } from "@base-ui-components/react/tabs";

import { cn } from "@/lib/shadcn/utils";

type TabsVariant = "default" | "underline";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2 data-[orientation=vertical]:flex-row", className)}
      {...props}
    />
  );
}

function TabsList({
  variant = "default",
  className,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant;
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "relative z-0 flex w-fit items-center justify-center gap-1 text-text-muted",
        "data-[orientation=vertical]:flex-col",
        variant === "default"
          ? "rounded-2xl bg-bg p-1"
          : "data-[orientation=horizontal]:py-2 data-[orientation=vertical]:py-2 data-[orientation=vertical]:gap-1",
        className,
      )}
      {...props}>
      {children}
      {variant === "default" && (
        <TabsPrimitive.Indicator
          data-slot="tab-indicator"
          className={cn(
            "absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out -z-1 rounded-2xl bg-bg-muted-light",
          )}
        />
      )}
    </TabsPrimitive.List>
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "flex flex-1 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary data-disabled:pointer-events-none data-disabled:opacity-64 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // Colors matching SidebarNavLink
        "text-text-muted hover:bg-bg-muted-light active:scale-95",
        "data-selected:bg-primary/10 data-selected:text-primary data-selected:font-medium",
        "gap-2 px-3 py-2.5",
        "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start",
        className,
      )}
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />;
}

export { Tabs, TabsPanel as TabsContent, TabsList, TabsPanel, TabsTab, TabsTab as TabsTrigger };
