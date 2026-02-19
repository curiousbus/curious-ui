import * as React from "react";

type Feature = {
  title: string;
  description: string;
};

type FeatureGridProps = {
  heading: string;
  features: Feature[];
};

export function FeatureGrid({ heading, features }: FeatureGridProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-xl border p-4">
            <h3 className="font-medium">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
