import * as React from "react";

type Plan = {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
};

type PricingCardsProps = {
  plans: Plan[];
};

export function PricingCards({ plans }: PricingCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={`rounded-2xl border p-6 ${plan.highlighted ? "border-primary shadow-md" : ""}`}
        >
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="mt-2 text-3xl font-bold">{plan.price}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {plan.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
