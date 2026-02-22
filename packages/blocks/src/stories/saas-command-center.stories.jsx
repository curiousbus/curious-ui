import { SaasCommandCenter } from "../saas-command-center";

export default {
  title: "Blocks/SaaS Command Center",
  component: SaasCommandCenter,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    actions: [
      {
        id: "invite-member",
        title: "Invite team member",
        description: "Create invitation with role and workspace scope.",
        group: "Team",
        shortcut: "G I",
      },
      {
        id: "pause-subscription",
        title: "Pause subscription",
        description: "Open billing controls for temporary suspension.",
        group: "Billing",
      },
      {
        id: "create-segment",
        title: "Create customer segment",
        description: "Define saved filters for lifecycle campaigns.",
        group: "Growth",
        shortcut: "G S",
      },
      {
        id: "rotate-token",
        title: "Rotate API token",
        description: "Regenerate server token and copy new secret.",
        group: "Security",
        badge: "urgent",
      },
      {
        id: "create-webhook",
        title: "Create webhook endpoint",
        description: "Publish event stream to your integration backend.",
        group: "Integrations",
      },
    ],
  },
};
