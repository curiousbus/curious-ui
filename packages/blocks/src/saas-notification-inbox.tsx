import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

export type SaasNotificationPriority = "low" | "normal" | "high";

export type SaasNotification = {
  id: string;
  title: string;
  body: string;
  category?: string;
  time: string;
  isRead?: boolean;
  priority?: SaasNotificationPriority;
};

type SaasNotificationInboxProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  description?: string;
  notifications: SaasNotification[];
  categories?: string[];
  onOpenNotification?: (notification: SaasNotification) => void;
  onMarkAsRead?: (notification: SaasNotification) => void;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function priorityDotClass(priority: SaasNotificationPriority | undefined) {
  if (priority === "high") {
    return "bg-destructive";
  }

  if (priority === "low") {
    return "bg-emerald-600";
  }

  return "bg-amber-500";
}

export function SaasNotificationInbox({
  title = "Notification Inbox",
  description = "Triage user, billing, and reliability events with fast context.",
  notifications,
  categories,
  onOpenNotification,
  onMarkAsRead,
  className,
  ...props
}: SaasNotificationInboxProps) {
  const shouldReduceMotion = useReducedMotion();
  const [tab, setTab] = React.useState<"all" | "unread">("all");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  const categoryOptions = React.useMemo(() => {
    const base = new Set(categories ?? []);

    for (const notification of notifications) {
      if (notification.category) {
        base.add(notification.category);
      }
    }

    return ["all", ...Array.from(base)];
  }, [categories, notifications]);

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((notification) => {
      if (tab === "unread" && notification.isRead) {
        return false;
      }

      if (activeCategory !== "all" && notification.category !== activeCategory) {
        return false;
      }

      return true;
    });
  }, [activeCategory, notifications, tab]);

  return (
    <section className={cn("rounded-xl border bg-card p-4", className)} {...props}>
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-balance">{title}</h2>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SegmentButton label="All" active={tab === "all"} onClick={() => setTab("all")} />
        <SegmentButton label="Unread" active={tab === "unread"} onClick={() => setTab("unread")} />

        <div className="ml-auto">
          <label htmlFor="saas-notification-category" className="sr-only">
            Notification category
          </label>
          <select
            id="saas-notification-category"
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={activeCategory}
            onChange={(event) => {
              setActiveCategory(event.target.value);
            }}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All categories" : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium">Inbox is clear</p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              No notifications match the current filters.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.article
              key={notification.id}
              className="rounded-lg border bg-background p-3"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 0.2, ease: "easeOut", delay: index * 0.02 }
              }
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1 size-2 rounded-full",
                    priorityDotClass(notification.priority),
                  )}
                />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">{notification.title}</p>
                    {notification.category ? (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {notification.category}
                      </span>
                    ) : null}
                    {!notification.isRead ? (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary">
                        New
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty">{notification.body}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="inline-flex h-8 items-center rounded-md border border-input bg-background px-2 text-xs font-medium transition-colors hover:bg-accent"
                    onClick={() => onOpenNotification?.(notification)}
                  >
                    Open
                  </button>
                  {!notification.isRead ? (
                    <button
                      type="button"
                      className="inline-flex h-8 items-center rounded-md border border-input bg-background px-2 text-xs font-medium transition-colors hover:bg-accent"
                      onClick={() => onMarkAsRead?.(notification)}
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}

function SegmentButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 items-center rounded-md border px-2 text-xs font-medium transition-colors",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-input bg-background text-muted-foreground hover:bg-accent",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
