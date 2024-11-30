import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { 
    files: ["**/*.js"],
    languageOptions: { 
      sourceType: "commonjs" 
    }
  },
  // Add a specific config for test files
  {
    files: ["**/*.test.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.jest,  // Add Jest globals
      }
    }
  },
  { 
    languageOptions: { 
      globals: { 
        ...globals.browser, 
        ...globals.node 
      } 
    } 
  },
  pluginJs.configs.recommended,
  {
    settings: {
      react: {
        version: 'detect'
      }
    },
    ...pluginReact.configs.flat.recommended
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "off",
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