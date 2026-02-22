import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";

export type SaasAuditSeverity = "info" | "warning" | "critical";

export type SaasAuditEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  severity?: SaasAuditSeverity;
  metadata?: Array<{ label: string; value: string }>;
};

type SaasAuditTimelineProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  description?: string;
  events: SaasAuditEvent[];
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function severityClass(severity: SaasAuditSeverity | undefined) {
  if (severity === "critical") {
    return "bg-destructive";
  }
  if (severity === "warning") {
    return "bg-amber-500";
  }
  return "bg-emerald-600";
}

export function SaasAuditTimeline({
  title = "Audit Timeline",
  description = "Track sensitive actions with actor context, resource scope, and event metadata.",
  events,
  className,
  ...props
}: SaasAuditTimelineProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("rounded-xl border bg-card p-4", className)} {...props}>
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-balance">{title}</h2>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </header>

      <ol className="mt-4 space-y-3">
        {events.map((event, index) => (
          <motion.li
            key={event.id}
            className="grid grid-cols-[16px,1fr] gap-3"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 0.2, ease: "easeOut", delay: index * 0.02 }
            }
          >
            <div className="flex h-full flex-col items-center">
              <span className={cn("mt-1 size-2 rounded-full", severityClass(event.severity))} />
              {index < events.length - 1 ? <span className="mt-1 h-full w-px bg-border" /> : null}
            </div>

            <article className="rounded-lg border bg-background p-3">
              <p className="text-sm font-medium">
                <span>{event.actor}</span>
                <span className="text-muted-foreground"> {event.action} </span>
                <span>{event.target}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{event.time}</p>

              {event.metadata && event.metadata.length > 0 ? (
                <dl className="mt-2 grid gap-1 sm:grid-cols-2">
                  {event.metadata.map((item) => (
                    <div
                      key={`${event.id}-${item.label}`}
                      className="rounded border bg-muted/40 px-2 py-1"
                    >
                      <dt className="text-[11px] text-muted-foreground">{item.label}</dt>
                      <dd className="truncate text-xs text-foreground">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </article>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
