type CtaBannerProps = {
  title: string;
  description?: string;
  actionLabel?: string;
};

export function CtaBanner({ title, description, actionLabel = "Start Now" }: CtaBannerProps) {
  return (
    <aside className="rounded-2xl bg-primary p-8 text-primary-foreground">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description ? <p className="mt-2 text-primary-foreground/80">{description}</p> : null}
        </div>
        <button type="button" className="rounded-lg bg-background px-4 py-2 text-foreground">
          {actionLabel}
        </button>
      </div>
    </aside>
  );
}
