import { expect, test } from "@playwright/test";
import { getFramework, gotoFixture } from "../helpers";

test("should load the correct framework bundle", async ({ page }) => {
  await gotoFixture(page, "story=core/basic.ink");
  await page.waitForSelector("#inkweave-story");

  const scripts = await page.evaluate(() =>
    Array.from(document.querySelectorAll("script[src]")).map((s) => (s as HTMLScriptElement).src),
  );

  const loadedBundle = scripts.find((src) => src.includes("inkweave"));
  let fw = `-${getFramework()}`
  if (fw === "-default") {
    fw = ".min";
  }
  expect(loadedBundle).toBeTruthy();
  console.log(`fw=${fw}, loaded=${loadedBundle}`);
  expect(loadedBundle).toContain(`inkweave${fw}`);
});
