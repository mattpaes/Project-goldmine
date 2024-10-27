import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  {
    // Add settings object here
    settings: {
      react: {
        version: 'detect'
      }
    },
    // Rest of your React config
    ...pluginReact.configs.flat.recommended
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "brace-style": ["error", "1tbs"],
      "prefer-const": "error",
      "max-len": ["warn", { "code": 120 }],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "react/prop-types": "error",
      "react/no-unused-state": "error",
      "react/jsx-no-bind": ["error", {
        "allowArrowFunctions": true,
        "allowFunctions": false,
        "allowBind": false
      }]
    }
  }
];