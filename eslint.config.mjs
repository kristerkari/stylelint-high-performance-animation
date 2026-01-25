import sortRequires from "eslint-plugin-sort-requires";

export default [
  {
    ignores: ["coverage/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        testRule: "readonly",
      },
    },
    plugins: {
      "sort-requires": sortRequires,
    },
    rules: {
      "eqeqeq": "error",
      "no-use-before-define": ["error", { "functions": false }],
      "sort-requires/sort-requires": "error",
      "strict": ["error", "global"],
      "arrow-spacing": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      "template-curly-spacing": "error",
    },
  },
];
