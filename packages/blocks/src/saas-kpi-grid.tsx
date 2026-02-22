import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

export type SaasKpiTone = "default" | "success" | "warning" | "danger";

export type SaasKpiTrend = {
  value: string;
  direction?: "up" | "down" | "flat";
  label?: string;
};

export type SaasKpiMetric = {
  id: string;
  label: string;
  value: string;
  helper?: string;
  trend?: SaasKpiTrend;
  tone?: SaasKpiTone;
  icon?: React.ReactNode;
  sparkline?: number[];
};

type SaasKpiGridProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  description?: string;
  metrics: SaasKpiMetric[];
  columns?: 2 | 3 | 4;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function toneClass(tone: SaasKpiTone | undefined) {
  if (tone === "success") {
    return "text-emerald-700";
  }

  if (tone === "warning") {
    return "text-amber-700";
  }

  if (tone === "danger") {
    return "text-destructive";
  }

  return "text-foreground";
}

function trendIcon(direction: SaasKpiTrend["direction"]) {
  if (direction === "up") {
    return <TrendUpIcon className="size-3.5" />;
  }
  if (direction === "down") {
    return <TrendDownIcon className="size-3.5" />;
  }
  return <TrendFlatIcon className="size-3.5" />;
}

function gridColumnClass(columns: SaasKpiGridProps["columns"]) {
  if (columns === 2) {
    return "md:grid-cols-2";
  }
  if (columns === 3) {
    return "md:grid-cols-2 xl:grid-cols-3";
  }
  return "md:grid-cols-2 xl:grid-cols-4";
}

function toSparklinePath(points: number[]) {
  if (points.length < 2) {
    return "";
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point - min) / range) * 100;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function Sparkline({ points }: { points: number[] }) {
  const path = React.useMemo(() => toSparklinePath(points), [points]);

  if (!path) {
    return null;
  }

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-20" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function SaasKpiGrid({
  title = "Business Snapshot",
  description = "Core SaaS metrics your team checks every day.",
  metrics,
  columns = 4,
  className,
  ...props
}: SaasKpiGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("space-y-4", className)} {...props}>
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-balance">{title}</h2>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </header>

      <div className={cn("grid gap-3", gridColumnClass(columns))}>
        {metrics.map((metric, index) => (
          <motion.article
            key={metric.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 0.2, ease: "easeOut", delay: index * 0.03 }
            }
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              {metric.icon ? <span className="text-muted-foreground">{metric.icon}</span> : null}
            </div>

            <div className="mt-2 flex items-end justify-between gap-3">
              <p className={cn("text-2xl font-semibold tabular-nums", toneClass(metric.tone))}>
                {metric.value}
              </p>
              {metric.sparkline && metric.sparkline.length > 1 ? (
                <div className="text-muted-foreground">
                  <Sparkline points={metric.sparkline} />
                </div>
              ) : null}
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              {metric.trend ? (
                <p className={cn("inline-flex items-center gap-1 text-xs", toneClass(metric.tone))}>
                  {trendIcon(metric.trend.direction)}
                  <span className="tabular-nums">{metric.trend.value}</span>
                  {metric.trend.label ? (
                    <span className="text-muted-foreground">{metric.trend.label}</span>
                  ) : null}
                </p>
              ) : (
                <span />
              )}

              {metric.helper ? (
                <p className="text-xs text-muted-foreground text-pretty">{metric.helper}</p>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

type IconProps = React.ComponentPropsWithoutRef<"svg">;

export function TrendUpIcon({ className, ...props }: IconProps) {
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
      <path d="M4 14 10 8l4 4 6-6" />
      <path d="M20 6h-4" />
      <path d="M20 6v4" />
    </svg>
  );
}

export function TrendDownIcon({ className, ...props }: IconProps) {
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
      <path d="M4 10 10 16l4-4 6 6" />
      <path d="M20 18h-4" />
      <path d="M20 18v-4" />
    </svg>
  );
}

export function TrendFlatIcon({ className, ...props }: IconProps) {
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
      <path d="M4 12h16" />
    </svg>
  );
}
