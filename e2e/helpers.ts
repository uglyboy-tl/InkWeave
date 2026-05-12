import type { Page } from "@playwright/test";

export const FRAMEWORK = process.env.FRAMEWORK || "default";

export async function gotoFixture(page: Page, params: string) {
  await page.goto(fixtureUrl(params));
}

export function fixtureUrl(params: string) {
  return `/e2e/fixtures/index.html?${params}&framework=${FRAMEWORK}`;
}

export function getFramework() {
  return FRAMEWORK;
}
