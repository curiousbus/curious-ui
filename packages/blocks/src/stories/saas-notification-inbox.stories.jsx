import { SaasNotificationInbox } from "../saas-notification-inbox";

export default {
  title: "Blocks/SaaS Notification Inbox",
  component: SaasNotificationInbox,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    notifications: [
      {
        id: "n-1",
        title: "Payment retry succeeded",
        body: "Invoice INV-4012 was collected after retry sequence.",
        category: "Billing",
        time: "2 min ago",
        priority: "normal",
      },
      {
        id: "n-2",
        title: "SAML policy update pending",
        body: "Security policy changes require owner approval.",
        category: "Security",
        time: "18 min ago",
        priority: "high",
      },
      {
        id: "n-3",
        title: "HubSpot sync completed",
        body: "89 records were synced into your CRM connector.",
        category: "Integrations",
        time: "1 hour ago",
        isRead: true,
        priority: "low",
      },
    ],
  },
};
