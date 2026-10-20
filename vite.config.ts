import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";
export default defineConfig({
   base: "/",
   plugins: [react()],
   resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
   server: { host: "127.0.0.1", port: 5173, strictPort: true },
   test: { environment: "jsdom", include: ["tests/cx/**/*.test.{ts,tsx}"], setupFiles: ["./tests/setup.ts"], restoreMocks: true },
   build: { outDir: "build", sourcemap: false },
});
