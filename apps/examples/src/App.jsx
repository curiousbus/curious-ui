import { CtaBanner, HeroSplit } from "@ftb/blocks";

export function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-8 p-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Component Preview</h1>
        <p className="text-muted-foreground">Production blocks currently available in this registry.</p>
      </div>
      <HeroSplit
        title="Build composable pages faster with real production blocks"
        description="Start from high-quality defaults, then adapt content, styling, and behavior directly in your product codebase."
        primaryActionLabel="Install Hero Split"
        secondaryActionLabel="Read Usage"
      />
      <div className="max-w-4xl">
        <CtaBanner
          title="Build the real component library"
          description="Use this CTA block as a conversion section under your hero or feature content."
          actionLabel="Start Building"
        />
      </div>
    </main>
  );
}
