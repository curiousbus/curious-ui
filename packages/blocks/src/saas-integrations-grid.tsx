import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";

export type SaasIntegrationStatus = "connected" | "available" | "beta";

export type SaasIntegration = {
  id: string;
  name: string;
  description: string;
  category: string;
  status?: SaasIntegrationStatus;
  icon?: React.ReactNode;
  metric?: string;
};

type SaasIntegrationsGridProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  description?: string;
  integrations: SaasIntegration[];
  onConnect?: (integration: SaasIntegration) => void;
  onConfigure?: (integration: SaasIntegration) => void;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function statusClass(status: SaasIntegrationStatus | undefined) {
  if (status === "connected") {
    return "bg-emerald-500/10 text-emerald-700";
  }
  if (status === "beta") {
    return "bg-amber-500/10 text-amber-700";
  }
  return "bg-muted text-muted-foreground";
}

export function SaasIntegrationsGrid({
  title = "Integrations",
  description = "Connect payments, CRM, support, and data stack providers into your SaaS operations.",
  integrations,
  onConnect,
  onConfigure,
  className,
  ...props
}: SaasIntegrationsGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("space-y-4", className)} {...props}>
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-balance">{title}</h2>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration, index) => {
          const isConnected = integration.status === "connected";

          return (
            <motion.article
              key={integration.id}
              className="rounded-lg border bg-card p-4"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 0.2, ease: "easeOut", delay: index * 0.02 }
              }
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground">
                    {integration.icon ?? <IntegrationIcon className="size-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.category}</p>
                  </div>
                </div>

                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[11px]",
                    statusClass(integration.status),
                  )}
                >
                  {integration.status ?? "available"}
                </span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground text-pretty">
                {integration.description}
              </p>

              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground tabular-nums">
                  {integration.metric ?? "No sync yet"}
                </p>
                <button
                  type="button"
                  className="inline-flex h-8 items-center rounded-md border border-input bg-background px-2 text-xs font-medium transition-colors hover:bg-accent"
                  onClick={() => {
                    if (isConnected) {
                      onConfigure?.(integration);
                    } else {
                      onConnect?.(integration);
                    }
                  }}
                >
                  {isConnected ? "Configure" : "Connect"}
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

type IconProps = React.ComponentPropsWithoutRef<"svg">;

export function IntegrationIcon({ className, ...props }: IconProps) {
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
