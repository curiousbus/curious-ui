import { SaasKpiGrid } from "../saas-kpi-grid";

export default {
  title: "Blocks/SaaS KPI Grid",
  component: SaasKpiGrid,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "Revenue & Product Health",
    description: "High-signal metrics for PM, growth, and platform reviews.",
    columns: 4,
    metrics: [
      {
        id: "mrr",
        label: "MRR",
        value: "$128,420",
        tone: "success",
        trend: { value: "+11.4%", direction: "up", label: "vs last month" },
        sparkline: [20, 23, 24, 26, 29, 30, 34],
      },
      {
        id: "churn",
        label: "Churn",
        value: "2.8%",
        tone: "warning",
        trend: { value: "-0.4%", direction: "down", label: "monthly" },
        sparkline: [8, 7, 7, 6, 5, 5, 4],
      },
      {
        id: "ltv",
        label: "LTV",
        value: "$1,942",
        tone: "default",
        trend: { value: "+6.2%", direction: "up", label: "quarterly" },
        sparkline: [13, 14, 15, 16, 15, 17, 18],
      },
      {
        id: "nps",
        label: "NPS",
        value: "48",
        tone: "success",
        trend: { value: "+2", direction: "up", label: "rolling 30d" },
        sparkline: [32, 34, 37, 39, 41, 45, 48],
      },
    ],
  },
};
