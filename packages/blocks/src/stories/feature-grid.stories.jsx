import { FeatureGrid } from "../feature-grid";

export default {
  title: "Blocks/Feature Grid",
  component: FeatureGrid,
  tags: ["autodocs"]
};

export const Default = {
  args: {
    heading: "Core Benefits",
    features: [
      { title: "Composable", description: "Drop into any page and customize quickly." },
      { title: "Accessible", description: "Semantic markup across every block." },
      { title: "Themeable", description: "Token-based colors and consistent spacing." },
      { title: "Portable", description: "Source-first output via shadcn registry." },
      { title: "Maintained", description: "Visual regression keeps updates safe." },
      { title: "Fast", description: "Install and iterate with predictable APIs." }
    ]
  }
};
