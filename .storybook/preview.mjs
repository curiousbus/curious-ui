import "../apps/examples/src/styles.css";

const withThemeClass = (Story, context) => {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", context.globals.theme === "dark");
  }
  return Story();
};

/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [withThemeClass],
  globalTypes: {
    theme: {
      name: "Theme",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" }
        ],
        dynamicTitle: true
      }
    }
  },
  globals: {
    theme: "light"
  },
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: "app-light",
      values: [
        { name: "app-light", value: "#ffffff" },
        { name: "app-dark", value: "#020817" },
        { name: "slate", value: "#f8fafc" }
      ]
    }
  }
};

export default preview;
