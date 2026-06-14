import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    theme: "src/theme/index.ts",
    shared: "src/shared/index.ts",
    components: "src/components/index.ts",
    "i18n/index": "src/i18n/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  external: ["react", "react-dom", "react-i18next"],
});
