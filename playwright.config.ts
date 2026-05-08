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
    if (framework === 'react') {
      return [{
        name: 'Edge (React)',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
        env: { FRAMEWORK: 'react' },
      }];
    } else if (framework === 'svelte') {
      return [{
        name: 'Edge (Svelte)',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
        env: { FRAMEWORK: 'svelte' },
      }];
    } else if (framework === 'solidjs') {
      return [{
        name: 'Edge (SolidJS)',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
        env: { FRAMEWORK: 'solidjs' },
      }];
    } else if (framework === 'all') {
      return [
        {
          name: 'Edge (React)',
          use: { ...devices['Desktop Edge'], channel: 'msedge' },
          env: { FRAMEWORK: 'react' },
        },
        {
          name: 'Edge (Svelte)',
          use: { ...devices['Desktop Edge'], channel: 'msedge' },
          env: { FRAMEWORK: 'svelte' },
        },
        {
          name: 'Edge (SolidJS)',
          use: { ...devices['Desktop Edge'], channel: 'msedge' },
          env: { FRAMEWORK: 'solidjs' },
        }
      ];
    } else {
      // default to solidjs
      return [{
        name: 'Edge (SolidJS)',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
        env: { FRAMEWORK: 'solidjs' },
      }];
    }
  })(),
  webServer: {
    command: 'vite --port 3141',
    port: 3141,
    reuseExistingServer: !process.env.CI,
  },
});