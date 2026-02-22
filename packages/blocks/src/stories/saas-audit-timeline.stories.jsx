import { SaasAuditTimeline } from "../saas-audit-timeline";

export default {
  title: "Blocks/SaaS Audit Timeline",
  component: SaasAuditTimeline,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    events: [
      {
        id: "a-1",
        actor: "Elena Brooks",
        action: "changed role for",
        target: "nora@acme.com",
        time: "Today 10:12",
        severity: "warning",
        metadata: [
          { label: "Before", value: "Viewer" },
          { label: "After", value: "Support" },
        ],
      },
      {
        id: "a-2",
        actor: "System",
        action: "revoked token for",
        target: "Webhook Worker",
        time: "Today 09:47",
        severity: "critical",
        metadata: [{ label: "Reason", value: "Leak signal from scanner" }],
      },
      {
        id: "a-3",
        actor: "Kai Lin",
        action: "created workspace",
        target: "EMEA Expansion",
        time: "Yesterday 18:03",
        severity: "info",
      },
    ],
  },
};
