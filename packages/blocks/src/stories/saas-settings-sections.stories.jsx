import { SaasSettingsSections } from "../saas-settings-sections";

export default {
  title: "Blocks/SaaS Settings Sections",
  component: SaasSettingsSections,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    sections: [
      {
        id: "identity",
        title: "Identity & SSO",
        description: "Domain verification, SAML, and SCIM provisioning controls.",
        status: "attention",
        items: [
          { label: "Domain", value: "acme.com verified" },
          { label: "SAML", value: "Okta (active)" },
        ],
      },
      {
        id: "security",
        title: "Security baseline",
        description: "Session policy, API secrets, and admin break-glass process.",
        status: "complete",
        items: [
          { label: "MFA policy", value: "Required" },
          { label: "Session timeout", value: "8 hours" },
        ],
      },
      {
        id: "notifications",
        title: "Notification routing",
        description: "Channel subscriptions for incidents, usage alerts, and billing events.",
        status: "draft",
      },
    ],
  },
};
