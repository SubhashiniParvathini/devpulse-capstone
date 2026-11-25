import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,         // Run sequentially locally for system stability
  workers: 1,                  // Use exactly 1 browser window at a time locally
  
  // Updated reporter block to permanently prevent EADDRINUSE and host-resolution errors [1]
  reporter: [
    ['html', { 
      host: '127.0.0.1',       // Bypasses IPv6 DNS lookups which cause UVException bugs
      port: 0, 
      open: 'always',                // Automatically maps to a random free port to prevent locks
    }]
  ],

  use: {
    headless: false,           // Keep browsers visible so you can watch them run
    viewport: { width: 375, height: 812 }, // Set mobile viewport globally for both tests
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});