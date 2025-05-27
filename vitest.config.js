import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.js"],
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "src/server.js",
        "src/app.js",
        "*.config.js",
        "**/*.config.js",
        "cypress/**",
        "public/**",
        "**/*.cy.js",
        "**/*.cy.ts",
      ],
    },
  },
  server: {
    port: 4000,
  },
});