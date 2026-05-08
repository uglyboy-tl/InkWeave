import type { Page } from "@playwright/test";

const FRAMEWORK = process.env.FRAMEWORK || "svelte";

export async function gotoFixture(page: Page, params: string) {
  let fw = "";
  if (FRAMEWORK === "svelte") {
    fw = "&framework=svelte";
  } else if (FRAMEWORK === "react") {
    fw = "&framework=react";
  }
  await page.goto(`/e2e/fixtures/index.html?${params}${fw}`);
}
