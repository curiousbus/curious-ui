import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";

export type SaasSettingSectionStatus = "complete" | "attention" | "draft";

export type SaasSettingSection = {
  id: string;
  title: string;
  description: string;
  status?: SaasSettingSectionStatus;
  items?: Array<{ label: string; value: string }>;
};

type SaasSettingsSectionsProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  description?: string;
  sections: SaasSettingSection[];
  onOpenSection?: (section: SaasSettingSection) => void;
};

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

function statusClass(status: SaasSettingSectionStatus | undefined) {
  if (status === "complete") {
    return "bg-emerald-500/10 text-emerald-700";
  }
  if (status === "attention") {
    return "bg-amber-500/10 text-amber-700";
  }
  return "bg-muted text-muted-foreground";
}

export function SaasSettingsSections({
  title = "Settings Workspace",
  description = "Organize security, identity, notifications, and workspace controls by section.",
  sections,
  onOpenSection,
  className,
  ...props
}: SaasSettingsSectionsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={cn("rounded-xl border bg-card p-4", className)} {...props}>
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-balance">{title}</h2>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </header>

      <div className="mt-4 space-y-2">
        {sections.map((section, index) => (
          <motion.article
            key={section.id}
            className="rounded-lg border bg-background p-3"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 0.2, ease: "easeOut", delay: index * 0.02 }
            }
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{section.title}</h3>
                  <span
                    className={cn("rounded px-1.5 py-0.5 text-[11px]", statusClass(section.status))}
                  >
                    {section.status ?? "draft"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-pretty">{section.description}</p>
              </div>

              <button
                type="button"
                className="inline-flex h-8 items-center rounded-md border border-input bg-background px-2 text-xs font-medium transition-colors hover:bg-accent"
                onClick={() => onOpenSection?.(section)}
              >
                Open section
              </button>
            </div>

            {section.items && section.items.length > 0 ? (
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {section.items.map((item) => (
                  <div
                    key={`${section.id}-${item.label}`}
                    className="rounded border bg-muted/40 px-2 py-1"
                  >
                    <dt className="text-[11px] text-muted-foreground">{item.label}</dt>
                    <dd className="truncate text-xs text-foreground">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
