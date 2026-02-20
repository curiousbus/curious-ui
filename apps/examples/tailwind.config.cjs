const shared = require("../../tailwind.config.cjs");

module.exports = {
  ...shared,
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/blocks/src/**/*.{js,jsx,ts,tsx}",
  ],
};
