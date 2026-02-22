import { SaasTeamRoster } from "../saas-team-roster";

export default {
  title: "Blocks/SaaS Team Roster",
  component: SaasTeamRoster,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    members: [
      {
        id: "u-1",
        name: "Elena Brooks",
        email: "elena@acme.com",
        role: "Owner",
        status: "active",
        lastSeen: "3m ago",
        mfaEnabled: true,
      },
      {
        id: "u-2",
        name: "Kai Lin",
        email: "kai@acme.com",
        role: "Admin",
        status: "active",
        lastSeen: "12m ago",
        mfaEnabled: true,
      },
      {
        id: "u-3",
        name: "Nora Singh",
        email: "nora@acme.com",
        role: "Support",
        status: "invited",
      },
      {
        id: "u-4",
        name: "Milo Carter",
        email: "milo@acme.com",
        role: "Analyst",
        status: "suspended",
        lastSeen: "2d ago",
      },
    ],
  },
};
