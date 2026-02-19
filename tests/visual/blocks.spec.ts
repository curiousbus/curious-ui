import { expect, test } from "@playwright/test";

const STORIES = [
  { id: "blocks-simple-hero--default", name: "simple-hero" },
  { id: "blocks-feature-grid--default", name: "feature-grid" },
  { id: "blocks-pricing-cards--default", name: "pricing-cards" },
  { id: "blocks-testimonial-wall--default", name: "testimonial-wall" },
  { id: "blocks-stats-strip--default", name: "stats-strip" },
  { id: "blocks-cta-banner--default", name: "cta-banner" }
];

test.describe("blocks visual regression", () => {
  for (const story of STORIES) {
    test(`${story.name} matches baseline`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      await page.waitForSelector("#storybook-root > *");
      await expect(page).toHaveScreenshot(`${story.name}.png`, {
        fullPage: true
      });
    });
  }
});
