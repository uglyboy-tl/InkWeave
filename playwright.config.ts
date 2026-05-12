import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: process.env.E2E_SYNTAX ? undefined : ["**/syntax/**"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  outputDir: "test-results",
  use: {
    baseURL: "http://localhost:3141",
    trace: "on-first-retry",
  },
  projects: (() => {
    const framework = process.env.FRAMEWORK || 'solidjs';
    const project = (name: string) => ({
      name,
      use: { ...devices['Desktop Edge'], channel: 'msedge' as const },
    });
    if (framework === 'react') {
      return [project('Edge (React)')];
    } else if (framework === 'svelte') {
      return [project('Edge (Svelte)')];
    } else if (framework === 'solidjs') {
      return [project('Edge (SolidJS)')];
    }
  })(),
  webServer: {
    command: 'vite --port 3141',
    port: 3141,
    reuseExistingServer: !process.env.CI,
  },
});
