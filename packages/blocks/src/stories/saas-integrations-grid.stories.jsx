import { SaasIntegrationsGrid } from "../saas-integrations-grid";

export default {
  title: "Blocks/SaaS Integrations Grid",
  component: SaasIntegrationsGrid,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    integrations: [
      {
        id: "stripe",
        name: "Stripe",
        category: "Payments",
        description: "Sync subscriptions, invoices, disputes, and payment intents.",
        status: "connected",
        metric: "Last sync 4 min ago",
      },
      {
        id: "hubspot",
        name: "HubSpot",
        category: "CRM",
        description: "Push account and lifecycle events into HubSpot objects.",
        status: "available",
        metric: "Not connected",
      },
      {
        id: "slack",
        name: "Slack",
        category: "Alerts",
        description: "Broadcast incidents and compliance events to channels.",
        status: "beta",
        metric: "Beta connector",
      },
    ],
  },
};
