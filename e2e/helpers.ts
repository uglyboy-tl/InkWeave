import type { Page } from "@playwright/test";

const FRAMEWORK = process.env.FRAMEWORK || "react";

export async function gotoFixture(page: Page, params: string) {
  const fw = FRAMEWORK === "svelte" ? "&framework=svelte" : "";
  await page.goto(`/e2e/fixtures/index.html?${params}${fw}`);
}
