import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "coverage/**", "brain/**", "tasks/**"] },
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { args: "none", caughtErrors: "none", varsIgnorePattern: "^_" },
      ],
      // React Compiler rules. These flag the ordinary load-on-mount pattern
      // used across the page components, so they report rather than gate:
      // satisfying them means restructuring data fetching, not fixing a bug.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/static-components": "warn",
      // Deliberate escape hatches in existing code. Reported, not gated:
      // tightening these is typing work, not a correctness fix.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
    },
  },
  {
    files: ["tests/**/*.{ts,tsx}", "vitest.setup.js"],
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.vitest } },
  },
);
