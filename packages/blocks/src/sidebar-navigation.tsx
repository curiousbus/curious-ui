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
        className="flex h-full min-h-[620px] w-7 items-center justify-center rounded-r-2xl border border-l-0 bg-muted/40 text-muted-foreground shadow-sm"
        onClick={() => setOpen(true)}
        whileHover={shouldReduceMotion ? undefined : { x: 2 }}
        aria-label="Reopen sidebar"
      >
        <RailReopenIcon />
      </motion.button>
    );
  }

  return (
    <motion.aside
      className={cn(
        "h-full min-h-[620px] overflow-hidden border-r border-border/80",
        "bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.16),_transparent_50%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.35))]",
        className,
      )}
      animate={shouldReduceMotion ? undefined : { width: collapsed ? 92 : 318 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.28, ease: "easeOut" }}
      style={{ width: collapsed ? 92 : 318 }}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-border/70 px-3 py-3">
          <div className="rounded-xl border border-border/70 bg-background/70 p-3 shadow-sm backdrop-blur">
            <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
                <BrandGlyph />
              </span>
              {!collapsed ? (
                <div className="min-w-0">
                  <p className="truncate text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {subtitle}
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <LayoutGroup id={`sidebar-highlight-${highlightLayoutId}`}>
          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
            {groups.map((group) => (
              <section key={group.id} className="space-y-2">
                <p
                  className={cn(
                    "flex items-center gap-2 px-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
                    collapsed && "sr-only",
                  )}
                >
                  <span>{group.label}</span>
                  <span className="h-px flex-1 bg-border/70" />
                </p>

                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const hasChildren = Boolean(item.children && item.children.length > 0);
                    const hasActiveChild = Boolean(
                      item.children?.some((child) => child.id === activeItemId),
                    );
                    const isActive = activeItemId === item.id || hasActiveChild;
                    const isSubmenuOpen = !collapsed && Boolean(expandedByItemId[item.id]);

                    return (
                      <li key={item.id} className="space-y-1">
                        <button
                          type="button"
                          className={cn(
                            "group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm text-muted-foreground transition",
                            "hover:bg-background/65 hover:text-foreground",
                            collapsed && "justify-center px-2",
                          )}
                          onClick={() => {
                            selectAction(item);
                            if (hasChildren) {
                              toggleSubmenu(item.id);
                            }
                          }}
                          aria-expanded={hasChildren ? isSubmenuOpen : undefined}
                          title={collapsed ? item.label : undefined}
                        >
                          {isActive ? (
                            <motion.span
                              layoutId={`active-item-${highlightLayoutId}`}
                              className="absolute inset-0 rounded-xl bg-[linear-gradient(90deg,hsl(var(--primary)/0.22),hsl(var(--primary)/0.12))] ring-1 ring-primary/30 shadow-[inset_0_1px_0_hsl(var(--background)/0.7)]"
                              transition={
                                shouldReduceMotion
                                  ? undefined
                                  : { duration: 0.24, ease: "easeInOut" }
                              }
                            />
                          ) : null}

                          <span
                            className={cn(
                              "relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-background/75 text-foreground/85 shadow-sm",
                              isActive && "border-primary/35 bg-background/95 text-primary",
                            )}
                          >
                            {item.icon ?? <DefaultItemIcon />}
                          </span>

                          {!collapsed ? (
                            <span className="relative z-10 flex min-w-0 flex-1 items-center justify-between gap-2">
                              <span className="truncate font-medium text-foreground">
                                {item.label}
                              </span>
                              {item.badge ? (
                                <span className="rounded-md border border-border/80 bg-background/85 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                  {item.badge}
                                </span>
                              ) : null}
                            </span>
                          ) : null}

                          {hasChildren && !collapsed ? (
                            <motion.span
                              className="relative z-10 text-muted-foreground"
                              animate={isSubmenuOpen ? { rotate: 90 } : { rotate: 0 }}
                              transition={
                                shouldReduceMotion ? undefined : { duration: 0.2, ease: "easeOut" }
                              }
                            >
                              <ChevronIcon />
                            </motion.span>
                          ) : null}
                        </button>

                        <AnimatePresence initial={false}>
                          {hasChildren && isSubmenuOpen ? (
                            <motion.ul
                              initial={
                                shouldReduceMotion ? undefined : { opacity: 0, height: 0, y: -4 }
                              }
                              animate={
                                shouldReduceMotion
                                  ? undefined
                                  : { opacity: 1, height: "auto", y: 0 }
                              }
                              exit={
                                shouldReduceMotion ? undefined : { opacity: 0, height: 0, y: -4 }
                              }
                              transition={
                                shouldReduceMotion ? undefined : { duration: 0.2, ease: "easeOut" }
                              }
                              className="ml-5 space-y-1 border-l border-border/70 pl-3"
                            >
                              {item.children?.map((child) => {
                                const isChildActive = activeItemId === child.id;
                                return (
                                  <li key={child.id}>
                                    <button
                                      type="button"
                                      className="group relative flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-muted-foreground transition hover:bg-background/60 hover:text-foreground"
                                      onClick={() => selectAction(child)}
                                    >
                                      {isChildActive ? (
                                        <motion.span
                                          layoutId={`active-item-${highlightLayoutId}`}
                                          className="absolute inset-0 rounded-lg bg-[linear-gradient(90deg,hsl(var(--primary)/0.2),hsl(var(--primary)/0.1))] ring-1 ring-primary/25"
                                          transition={
                                            shouldReduceMotion
                                              ? undefined
                                              : { duration: 0.24, ease: "easeInOut" }
                                          }
                                        />
                                      ) : null}

                                      <span className="relative z-10 inline-flex h-5 w-5 items-center justify-center rounded-md border border-border/80 bg-background/80 text-foreground/80">
                                        {child.icon ?? <SubmenuFallbackIcon />}
                                      </span>
                                      <span className="relative z-10 truncate font-medium text-foreground">
                                        {child.label}
                                      </span>
                                      {child.badge ? (
                                        <span className="relative z-10 ml-auto rounded border border-border/75 bg-background/80 px-1 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                                          {child.badge}
                                        </span>
                                      ) : null}
                                    </button>
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

  return (
    <motion.button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/85 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm",
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
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      {...props}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center">
        <CollapseIcon collapsed={collapsed} />
      </span>
      <span>{label ?? (collapsed ? "Expand" : "Collapse")}</span>
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

  return (
    <motion.button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/85 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        toggleOpen();
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      aria-label={open ? "Hide sidebar" : "Show sidebar"}
      {...props}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center">
        <VisibilityIcon open={open} />
      </span>
      <span>{label ?? (open ? "Hide Sidebar" : "Show Sidebar")}</span>
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
      <path
        d="M5.5 6.5H18.5M5.5 12H18.5M5.5 17.5H14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DefaultItemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SubmenuFallbackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M7 12H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 7L17 12L12 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
