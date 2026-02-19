import "../apps/examples/src/styles.css";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: "app",
      values: [
        { name: "app", value: "#ffffff" },
        { name: "slate", value: "#f8fafc" }
      ]
    }
  }
};

export default preview;
