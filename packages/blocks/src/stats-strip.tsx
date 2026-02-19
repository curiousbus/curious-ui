import * as React from "react";

type Stat = {
  label: string;
  value: string;
};

type StatsStripProps = {
  stats: Stat[];
};

export function StatsStrip({ stats }: StatsStripProps) {
  return (
    <section className="rounded-2xl border bg-muted/40 p-6">
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="text-2xl font-semibold">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
