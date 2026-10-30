import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "server",
      root: "./server",
      environment: "node",
      include: ["src/**/*.test.ts"],
    },
  },
  {
    test: {
      name: "client",
      root: "./client",
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      globals: true,
    },
  },
]);
