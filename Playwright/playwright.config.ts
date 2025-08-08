import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",
  retries: 0,
  timeout: 40000,
  expect: {
    timeout: 10000,
  },

  
  use: {
    baseURL: "https://healthapp.yaksha.com",
    trace: "on",
    headless: false,
    screenshot: "only-on-failure",
    video: "retry-with-video",
    permissions: ['clipboard-read', 'clipboard-write'], // :point_left: this line is crucial
  
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1520, height: 1080 },
        launchOptions: {
          args: ["--disable-web-security"],
        },
      },
    },
  ],

  reporter: [
    ["list"], // Default console output
    [
      "./jest/PlaywrightCustomReporter.js",
      { customOption: "value" }, // Optional configuration for the custom reporter
    ],
  ],
});
