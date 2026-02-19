import { PricingCards } from "../pricing-cards";

export default {
  title: "Blocks/Pricing Cards",
  component: PricingCards,
  tags: ["autodocs"]
};

export const Default = {
  args: {
    plans: [
      { name: "Starter", price: "$0", features: ["1 project", "Community support"] },
      { name: "Team", price: "$49", features: ["10 projects", "Priority fixes"], highlighted: true },
      { name: "Scale", price: "$149", features: ["Unlimited projects", "Dedicated support"] }
    ]
  }
};
