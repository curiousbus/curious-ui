import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

export type SaasCommandAction = {
  id: string;
  title: string;
  description?: string;
  group?: string;
  shortcut?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: (id: string) => void | Promise<void>;
};

type SaasCommandCenterProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  description?: string;
  placeholder?: string;
  actions: SaasCommandAction[];
  defaultQuery?: string;
  onActionSelect?: (actionId: string) => void | Promise<void>;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function SaasCommandCenter({
  title = "Command Center",
  description = "Launch common SaaS admin actions in a single surface.",
  placeholder = "Search command, member, billing, integration...",
  actions,
  defaultQuery = "",
  onActionSelect,
  className,
  ...props
}: SaasCommandCenterProps) {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = React.useState(defaultQuery);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  const normalizedQuery = normalizeText(query);

  const filteredActions = React.useMemo(() => {
    if (!normalizedQuery) {
      return actions;
    }

    return actions.filter((action) => {
      return [action.title, action.description ?? "", action.group ?? "", action.shortcut ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [actions, normalizedQuery]);

  const groupedActions = React.useMemo(() => {
    const groups = new Map<string, SaasCommandAction[]>();

    for (const action of filteredActions) {
      const group = action.group ?? "General";
      const existing = groups.get(group);
      if (existing) {
        existing.push(action);
      } else {
        groups.set(group, [action]);
      }
    }

    return Array.from(groups.entries());
  }, [filteredActions]);

  const handleSelect = async (action: SaasCommandAction) => {
    if (action.disabled) {
      return;
    }

    const result = action.onSelect?.(action.id);
    if (result && typeof (result as Promise<void>).then === "function") {
      setPendingId(action.id);
      try {
        await result;
      } finally {
        setPendingId(null);
      }
    }

    void onActionSelect?.(action.id);
  };

  return (
    <section className={cn("rounded-xl border bg-card p-4", className)} {...props}>
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-balance">{title}</h2>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </header>

      <div className="mt-4 rounded-lg border bg-background p-2">
        <label htmlFor="saas-command-search" className="sr-only">
          Search commands
        </label>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="saas-command-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder={placeholder}
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs outline-none transition focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {groupedActions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">No command found</p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Try a broader keyword such as billing, members, or integration.
            </p>
          </div>
        ) : (
          groupedActions.map(([group, groupActions]) => (
            <div key={group} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{group}</p>
              <div className="space-y-2">
                {groupActions.map((action, index) => {
                  const isPending = pendingId === action.id;

                  return (
                    <motion.button
                      key={action.id}
                      type="button"
                      onClick={() => {
                        void handleSelect(action);
                      }}
                      disabled={action.disabled || isPending}
                      className="flex w-full items-center gap-3 rounded-lg border bg-background px-3 py-2 text-left transition-colors hover:bg-accent/60 disabled:opacity-60"
                      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : { duration: 0.2, ease: "easeOut", delay: index * 0.02 }
                      }
                      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
                    >
                      <span className="text-muted-foreground">
                        {action.icon ?? <ActionIcon className="size-4" />}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{action.title}</span>
                          {action.badge ? (
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground tabular-nums">
                              {action.badge}
                            </span>
                          ) : null}
                        </span>
                        {action.description ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            {action.description}
                          </span>
                        ) : null}
                      </span>

                      {action.shortcut ? (
                        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground tabular-nums">
                          {action.shortcut}
                        </kbd>
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

type IconProps = React.ComponentPropsWithoutRef<"svg">;

export function SearchIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function ActionIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 13h6" />
    </svg>
  );
}
