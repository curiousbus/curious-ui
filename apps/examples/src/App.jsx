import { CtaBanner } from "@ftb/blocks";

export function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center p-8">
      <div className="w-full space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Component Preview</h1>
        <p className="text-muted-foreground">
          Starter blocks removed. This examples app now shows the remaining active block while new components are being added.
        </p>
        <CtaBanner
          title="Build the real component library"
          description="This is the current active block in the registry."
          actionLabel="Start Building"
        />
      </div>
    </main>
  );
}
