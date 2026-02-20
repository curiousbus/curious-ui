import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import * as React from "react";

type SidebarNavAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  onSelect?: (id: string) => void;
};

export type SidebarNavItem = SidebarNavAction & {
  children?: SidebarNavAction[];
};

export type SidebarNavGroup = {
  id: string;
  label: string;
  items: SidebarNavItem[];
};

type SidebarNavProviderProps = {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type SidebarNavPanelProps = {
  groups: SidebarNavGroup[];
  defaultActiveItemId?: string;
  activeItemId?: string;
  onActiveItemChange?: (id: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
  showRailWhenHidden?: boolean;
};

type SidebarNavTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

type SidebarNavContextValue = {
  collapsed: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleCollapsed: () => void;
  toggleOpen: () => void;
};

const SidebarNavContext = React.createContext<SidebarNavContextValue | null>(null);
const SIDEBAR_WIDTH = 256;
const SIDEBAR_WIDTH_ICON = 48;
const SIDEBAR_WIDTH_TRANSITION = { duration: 0.28, ease: "easeOut" as const };
const HIGHLIGHT_TRANSITION = { duration: 0.24, ease: "easeInOut" as const };
const ACTIVE_HIGHLIGHT_CLASS =
  "absolute inset-0 rounded-md border border-sidebar-primary/45 bg-gradient-to-b from-sidebar-primary/28 to-sidebar-primary/14 ring-1 ring-sidebar-primary/30 shadow-sm";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}) {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      if (!isControlled) {
        setInternal(resolved);
      }
      onChange?.(resolved);
    },
    [current, isControlled, onChange],
  );

  return [current, setValue] as const;
}

function findFirstItemId(groups: SidebarNavGroup[]) {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.id) {
        return item.id;
      }
      if (item.children?.[0]?.id) {
        return item.children[0].id;
      }
    }
  }
  return "";
}

function findParentItemId(groups: SidebarNavGroup[], childId: string) {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.children?.some((child) => child.id === childId)) {
        return item.id;
      }
    }
  }
  return null;
}

function buildInitialExpandedMap(groups: SidebarNavGroup[], activeId: string) {
  const expanded: Record<string, boolean> = {};
  const parentId = findParentItemId(groups, activeId);
  if (parentId) {
    expanded[parentId] = true;
  }
  return expanded;
}

function useSidebarNav() {
  const context = React.useContext(SidebarNavContext);
  if (!context) {
    throw new Error("Sidebar navigation components must be used within SidebarNavProvider.");
  }
  return context;
}

export function SidebarNavProvider({
  children,
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
}: SidebarNavProviderProps) {
  const [collapsed, setCollapsed] = useControllableState<boolean>({
    value: collapsedProp,
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
  });
  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const value = React.useMemo(
    () => ({
      collapsed,
      open,
      setOpen,
      toggleCollapsed: () => setCollapsed((prev) => !prev),
      toggleOpen: () => setOpen((prev) => !prev),
    }),
    [collapsed, open, setCollapsed, setOpen],
  );

  return <SidebarNavContext.Provider value={value}>{children}</SidebarNavContext.Provider>;
}

export function SidebarNavPanel({
  groups,
  defaultActiveItemId,
  activeItemId: activeItemIdProp,
  onActiveItemChange,
  title = "Workspace",
  subtitle = "Navigation",
  className,
  showRailWhenHidden = true,
}: SidebarNavPanelProps) {
  const { collapsed, open, setOpen } = useSidebarNav();
  const shouldReduceMotion = useReducedMotion();

  const defaultActive = React.useMemo(
    () => defaultActiveItemId ?? findFirstItemId(groups),
    [defaultActiveItemId, groups],
  );

  const [activeItemId, setActiveItemId] = useControllableState<string>({
    value: activeItemIdProp,
    defaultValue: defaultActive,
    onChange: onActiveItemChange,
  });

  const [expandedByItemId, setExpandedByItemId] = React.useState<Record<string, boolean>>(() =>
    buildInitialExpandedMap(groups, defaultActive),
  );

  React.useEffect(() => {
    const parentId = findParentItemId(groups, activeItemId);
    if (!parentId) {
      return;
    }
    setExpandedByItemId((prev) => {
      if (prev[parentId]) {
        return prev;
      }
      return {
        ...prev,
        [parentId]: true,
      };
    });
  }, [activeItemId, groups]);

  const highlightLayoutId = React.useId();

  const selectAction = React.useCallback(
    (action: SidebarNavAction) => {
      setActiveItemId(action.id);
      action.onSelect?.(action.id);
    },
    [setActiveItemId],
  );

  const toggleSubmenu = React.useCallback((itemId: string) => {
    setExpandedByItemId((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  if (!open) {
    if (!showRailWhenHidden) {
      return null;
    }

    return (
      <motion.button
        type="button"
        className="flex h-full min-h-[620px] w-4 items-center justify-center border-r border-sidebar-border bg-sidebar text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        onClick={() => setOpen(true)}
        whileHover={shouldReduceMotion ? undefined : { x: 3 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        aria-label="Reopen sidebar"
      >
        <RailReopenIcon />
      </motion.button>
    );
  }

  return (
    <motion.aside
      className={cn(
        "h-full min-h-[620px] overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
      animate={
        shouldReduceMotion ? undefined : { width: collapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH }
      }
      transition={shouldReduceMotion ? undefined : SIDEBAR_WIDTH_TRANSITION}
      style={{ width: collapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b border-sidebar-border px-2">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <BrandGlyph />
            </span>
            <AnimatePresence initial={false}>
              {!collapsed ? (
                <motion.div
                  className="min-w-0"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.24, ease: "easeOut" }}
                >
                  <p className="truncate text-[11px] uppercase tracking-wide text-sidebar-foreground/60">
                    {subtitle}
                  </p>
                  <p className="truncate text-sm font-semibold text-sidebar-foreground">{title}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <LayoutGroup id={`sidebar-highlight-${highlightLayoutId}`}>
          <nav className="flex-1 overflow-y-auto">
            {groups.map((group) => (
              <section key={group.id} className="relative flex w-full min-w-0 flex-col p-2">
                <p
                  className={cn(
                    "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70",
                    collapsed && "sr-only",
                  )}
                >
                  {group.label}
                </p>

                <ul className="flex w-full min-w-0 flex-col gap-1">
                  {group.items.map((item) => {
                    const hasChildren = Boolean(item.children && item.children.length > 0);
                    const hasActiveChild = Boolean(
                      item.children?.some((child) => child.id === activeItemId),
                    );
                    const isActive = activeItemId === item.id || hasActiveChild;
                    const isSubmenuOpen = !collapsed && Boolean(expandedByItemId[item.id]);

                    return (
                      <li key={item.id} className="group/menu-item relative space-y-1">
                        <motion.button
                          type="button"
                          className={cn(
                            "peer/menu-button relative flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[color,background-color,width,padding,height]",
                            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
                            isActive && "font-medium text-sidebar-primary",
                            collapsed && "size-8 justify-center p-2",
                          )}
                          onClick={() => {
                            selectAction(item);
                            if (hasChildren) {
                              toggleSubmenu(item.id);
                            }
                          }}
                          aria-expanded={hasChildren ? isSubmenuOpen : undefined}
                          title={collapsed ? item.label : undefined}
                          whileHover={
                            shouldReduceMotion ? undefined : collapsed ? { scale: 1.04 } : { x: 3 }
                          }
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                        >
                          {isActive ? (
                            <motion.span
                              layoutId={`active-item-${highlightLayoutId}`}
                              layout
                              className={ACTIVE_HIGHLIGHT_CLASS}
                              transition={shouldReduceMotion ? undefined : HIGHLIGHT_TRANSITION}
                            />
                          ) : null}

                          <span className="relative z-10 inline-flex size-4 shrink-0 items-center justify-center">
                            {item.icon ?? <DefaultItemIcon />}
                          </span>

                          {!collapsed ? (
                            <span className="relative z-10 flex min-w-0 flex-1 items-center justify-between gap-2">
                              <span className="truncate">{item.label}</span>
                              {item.badge ? (
                                <span className="pointer-events-none absolute right-1 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground/80">
                                  {item.badge}
                                </span>
                              ) : null}
                            </span>
                          ) : null}

                          {hasChildren && !collapsed ? (
                            <motion.span
                              className="relative z-10 text-sidebar-foreground/60"
                              animate={isSubmenuOpen ? { rotate: 90 } : { rotate: 0 }}
                              transition={
                                shouldReduceMotion ? undefined : { duration: 0.2, ease: "easeOut" }
                              }
                            >
                              <ChevronIcon />
                            </motion.span>
                          ) : null}
                        </motion.button>

                        <AnimatePresence initial={false}>
                          {hasChildren && isSubmenuOpen ? (
                            <motion.ul
                              initial={
                                shouldReduceMotion ? undefined : { opacity: 0, height: 0, y: -6 }
                              }
                              animate={
                                shouldReduceMotion
                                  ? undefined
                                  : { opacity: 1, height: "auto", y: 0 }
                              }
                              exit={
                                shouldReduceMotion ? undefined : { opacity: 0, height: 0, y: -6 }
                              }
                              transition={
                                shouldReduceMotion ? undefined : { duration: 0.2, ease: "easeOut" }
                              }
                              className="border-sidebar-border ml-3.5 mr-0 flex w-[calc(100%-0.875rem)] min-w-0 translate-x-px flex-col gap-1 border-l pl-2.5 pr-0 py-0.5"
                            >
                              {item.children?.map((child) => {
                                const isChildActive = activeItemId === child.id;
                                return (
                                  <li
                                    key={child.id}
                                    className="group/menu-sub-item relative w-full"
                                  >
                                    <motion.button
                                      type="button"
                                      className={cn(
                                        "relative flex h-7 w-full min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-left outline-hidden ring-sidebar-ring transition-colors",
                                        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground",
                                        isChildActive && "text-sidebar-primary",
                                      )}
                                      onClick={() => selectAction(child)}
                                      whileHover={shouldReduceMotion ? undefined : { x: 3 }}
                                      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                                    >
                                      {isChildActive ? (
                                        <motion.span
                                          layoutId={`active-item-${highlightLayoutId}`}
                                          layout
                                          className={ACTIVE_HIGHLIGHT_CLASS}
                                          transition={
                                            shouldReduceMotion ? undefined : HIGHLIGHT_TRANSITION
                                          }
                                        />
                                      ) : null}

                                      <span className="relative z-10 inline-flex size-4 shrink-0 items-center justify-center text-sidebar-accent-foreground">
                                        {child.icon ?? <SubmenuFallbackIcon />}
                                      </span>
                                      <span className="relative z-10 truncate text-sm">
                                        {child.label}
                                      </span>
                                      {child.badge ? (
                                        <span className="relative z-10 ml-auto rounded-md px-1 text-xs tabular-nums text-sidebar-foreground/80">
                                          {child.badge}
                                        </span>
                                      ) : null}
                                    </motion.button>
                                  </li>
                                );
                              })}
                            </motion.ul>
                          ) : null}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>
        </LayoutGroup>
      </div>
    </motion.aside>
  );
}

export function SidebarNavCollapseTrigger({
  className,
  label,
  onClick,
  ...props
}: SidebarNavTriggerProps) {
  const { collapsed, open, setOpen, toggleCollapsed } = useSidebarNav();
  const shouldReduceMotion = useReducedMotion();

  const hasLabel = Boolean(label);

  return (
    <motion.button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md outline-hidden ring-ring transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2",
        hasLabel ? "h-8 gap-2 px-2.5 text-sm" : "size-7",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        if (!open) {
          setOpen(true);
          return;
        }
        toggleCollapsed();
      }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      {...props}
    >
      <span className="inline-flex size-4 items-center justify-center">
        <CollapseIcon collapsed={collapsed} />
      </span>
      {hasLabel ? <span>{label}</span> : <span className="sr-only">Toggle Sidebar</span>}
    </motion.button>
  );
}

export function SidebarNavVisibilityTrigger({
  className,
  label,
  onClick,
  ...props
}: SidebarNavTriggerProps) {
  const { open, toggleOpen } = useSidebarNav();
  const shouldReduceMotion = useReducedMotion();

  const hasLabel = Boolean(label);

  return (
    <motion.button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-md outline-hidden ring-ring transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2",
        hasLabel ? "h-8 gap-2 px-2.5 text-sm" : "size-7",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        toggleOpen();
      }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      aria-label={open ? "Hide sidebar" : "Show sidebar"}
      {...props}
    >
      <span className="inline-flex size-4 items-center justify-center">
        <VisibilityIcon open={open} />
      </span>
      {hasLabel ? <span>{label}</span> : <span className="sr-only">Toggle Sidebar Visibility</span>}
    </motion.button>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d={collapsed ? "M10 8L14 12L10 16" : "M14 8L10 12L14 16"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VisibilityIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M3 6.5H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 17.5H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {!open ? (
        <path d="M4 4L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : null}
    </svg>
  );
}

function RailReopenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M8 6L14 12L8 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BrandGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function DefaultItemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SubmenuFallbackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M8 12H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 8L16 12L12 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
