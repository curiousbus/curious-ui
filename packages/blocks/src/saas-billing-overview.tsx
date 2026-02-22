import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";

export type SaasUsageItem = {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit?: string;
};

export type SaasInvoiceSummary = {
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  currency?: string;
};

type SaasBillingOverviewProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  description?: string;
  planName: string;
  monthlyPrice: number;
  currency?: string;
  renewalDate: string;
  usage: SaasUsageItem[];
  invoice?: SaasInvoiceSummary;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function progressValue(used: number, limit: number) {
  if (limit <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(100, (used / limit) * 100));
}

function usageTone(percent: number) {
  if (percent >= 90) {
    return "bg-destructive";
  }
  if (percent >= 70) {
    return "bg-amber-500";
  }
  return "bg-emerald-600";
}

export function SaasBillingOverview({
  title = "Billing & Usage",
  description = "Track your active plan, renewal date, and operational usage limits.",
  planName,
  monthlyPrice,
  currency = "USD",
  renewalDate,
  usage,
  invoice,
  ctaLabel = "Manage billing",
  onCtaClick,
  className,
  ...props
}: SaasBillingOverviewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("rounded-xl border bg-card p-4", className)} {...props}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold text-balance">{title}</h2>
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        </header>

        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
          onClick={onCtaClick}
        >
          {ctaLabel}
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr,1fr]">
        <article className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="mt-1 text-xl font-semibold text-balance">{planName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground tabular-nums">
                {formatMoney(monthlyPrice, currency)}
              </span>{" "}
              / month
            </p>
            <p>Renews on {renewalDate}</p>
          </div>

          <div className="mt-4 space-y-3">
            {usage.map((item, index) => {
              const percent = progressValue(item.used, item.limit);

              return (
                <motion.div
                  key={item.id}
                  className="space-y-1"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : { duration: 0.2, ease: "easeOut", delay: index * 0.03 }
                  }
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <p className="text-muted-foreground">{item.label}</p>
                    <p className="text-foreground tabular-nums">
                      {item.used}
                      {item.unit ? ` ${item.unit}` : ""} / {item.limit}
                      {item.unit ? ` ${item.unit}` : ""}
                    </p>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={cn("h-full rounded-full", usageTone(percent))}
                      initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
                      animate={shouldReduceMotion ? undefined : { scaleX: percent / 100 }}
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : { duration: 0.22, ease: "easeOut", delay: index * 0.02 }
                      }
                      style={{ transformOrigin: "left center" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </article>

        <article className="rounded-lg border bg-background p-4">
          <p className="text-sm font-medium">Invoice summary</p>

          {invoice ? (
            <dl className="mt-3 space-y-2 text-sm tabular-nums">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatMoney(invoice.subtotal, invoice.currency ?? currency)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Discount</dt>
                <dd>{formatMoney(invoice.discount ?? 0, invoice.currency ?? currency)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Tax</dt>
                <dd>{formatMoney(invoice.tax ?? 0, invoice.currency ?? currency)}</dd>
              </div>
              <div className="my-1 border-t" />
              <div className="flex items-center justify-between gap-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatMoney(invoice.total, invoice.currency ?? currency)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Add invoice details to show a full breakdown for finance and procurement.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
