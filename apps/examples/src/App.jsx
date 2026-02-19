import {
  CtaBanner,
  FeatureGrid,
  PricingCards,
  SimpleHero,
  StatsStrip,
  TestimonialWall
} from "@ftb/blocks";

const FEATURES = [
  { title: "Composable", description: "Drop blocks into any React app with shadcn registry install." },
  { title: "Accessible", description: "Semantic markup and keyboard-friendly interactions by default." },
  { title: "Themeable", description: "Use design tokens and Tailwind utility classes without lock-in." },
  { title: "Portable", description: "Ship source-first components that teams can fully customize." },
  { title: "Typed", description: "Clear props contracts make integration fast and predictable." },
  { title: "CI-Ready", description: "Lint, smoke install, and visual regression checks included." }
];

const PLANS = [
  { name: "Starter", price: "$0", features: ["1 project", "Community support", "Registry updates"] },
  { name: "Team", price: "$49", features: ["10 projects", "Shared themes", "Priority fixes"], highlighted: true },
  { name: "Scale", price: "$149", features: ["Unlimited projects", "Dedicated support", "Design system sync"] }
];

const TESTIMONIALS = [
  {
    quote: "We cut landing page implementation time by more than half.",
    author: "Avery Chen",
    role: "Staff Frontend Engineer"
  },
  {
    quote: "The blocks are predictable and easy to adapt to our product language.",
    author: "Jordan Patel",
    role: "Design Systems Lead"
  },
  {
    quote: "Visual regression made block upgrades much safer in CI.",
    author: "Riley Brooks",
    role: "Frontend Platform"
  },
  {
    quote: "Our teams can move faster without sacrificing consistency.",
    author: "Taylor Morgan",
    role: "Engineering Manager"
  }
];

const STATS = [
  { label: "Blocks", value: "6" },
  { label: "Install Time", value: "< 30s" },
  { label: "CI Checks", value: "4" },
  { label: "Release Mode", value: "Automated" }
];

export function App() {
  return (
    <main className="mx-auto max-w-6xl space-y-16 p-8">
      <SimpleHero
        title="Frontend Template Blocks"
        subtitle="Reusable shadcn-ready blocks for fast product delivery."
        primaryActionLabel="Browse Blocks"
        secondaryActionLabel="Open Registry"
      />

      <FeatureGrid heading="Why Teams Use It" features={FEATURES} />

      <PricingCards plans={PLANS} />

      <StatsStrip stats={STATS} />

      <TestimonialWall title="What Teams Say" items={TESTIMONIALS} />

      <CtaBanner
        title="Ship your next page faster"
        description="Install blocks directly with shadcn CLI and customize in-place."
        actionLabel="Get Started"
      />
    </main>
  );
}
