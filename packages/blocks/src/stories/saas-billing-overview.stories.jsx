import { SaasBillingOverview } from "../saas-billing-overview";

export default {
  title: "Blocks/SaaS Billing Overview",
  component: SaasBillingOverview,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    planName: "Scale Annual",
    monthlyPrice: 2490,
    currency: "USD",
    renewalDate: "Apr 14, 2026",
    usage: [
      { id: "members", label: "Members", used: 112, limit: 150 },
      { id: "projects", label: "Projects", used: 43, limit: 80 },
      { id: "api", label: "API calls", used: 734000, limit: 1000000 },
      { id: "storage", label: "Storage", used: 612, limit: 1000, unit: "GB" },
    ],
    invoice: {
      subtotal: 2490,
      discount: -250,
      tax: 179.2,
      total: 2419.2,
      currency: "USD",
    },
  },
};
