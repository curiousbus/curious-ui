type HeroSplitProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  highlights?: string[];
};

const DEFAULT_HIGHLIGHTS = ["No lock-in", "Accessible by default", "Install with shadcn add"];

export function HeroSplit({
  eyebrow = "Production Ready",
  title,
  description,
  primaryActionLabel = "Get Started",
  secondaryActionLabel = "View Docs",
  highlights = DEFAULT_HIGHLIGHTS,
}: HeroSplitProps) {
  return (
    <section className="overflow-hidden rounded-3xl border bg-background">
      <div className="grid gap-8 p-8 md:grid-cols-2 md:p-10">
        <div className="space-y-5">
          <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {primaryActionLabel}
            </button>
            <button
              type="button"
              className="rounded-lg border px-5 py-2.5 text-sm font-medium text-foreground"
            >
              {secondaryActionLabel}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-muted/30 p-6">
          <p className="text-sm font-medium text-muted-foreground">Why teams use this block</p>
          <ul className="mt-4 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-xl bg-background p-4 shadow-sm ring-1 ring-border/60">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Typical outcome</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              2x faster landing page assembly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
