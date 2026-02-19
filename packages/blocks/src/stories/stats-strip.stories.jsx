import { StatsStrip } from "../stats-strip";

export default {
  title: "Blocks/Stats Strip",
  component: StatsStrip,
  tags: ["autodocs"]
};

export const Default = {
  args: {
    stats: [
      { label: "Blocks", value: "6" },
      { label: "Install Time", value: "< 30s" },
      { label: "Coverage", value: "100%" },
      { label: "CI", value: "Green" }
    ]
  }
};
