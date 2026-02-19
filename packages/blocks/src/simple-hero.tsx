import * as React from "react";

type SimpleHeroProps = {
  title: string;
  subtitle?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
};

export function SimpleHero({
  title,
  subtitle,
  primaryActionLabel = "Get Started",
  secondaryActionLabel = "Learn More"
}: SimpleHeroProps) {
  return (
    <section className="rounded-2xl border bg-background p-8 shadow-sm">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-4 text-muted-foreground">{subtitle}</p> : null}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">{primaryActionLabel}</button>
          <button className="rounded-lg border px-4 py-2">{secondaryActionLabel}</button>
        </div>
      </div>
    </section>
  );
}
