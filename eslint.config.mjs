import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import sonarjs from "eslint-plugin-sonarjs";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      prettier,
      sonarjs,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      // Prettier
      "prettier/prettier": "error",
      // SonarJS — code smells
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/cognitive-complexity": ["warn", 15],
      // Accessibility
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      // TypeScript strictness
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];