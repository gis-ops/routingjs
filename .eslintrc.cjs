module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.eslint.json",
        ecmaVersion: 2020,
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    env: {
        node: true,
        es6: true,
    },
    plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
    rules: {
        "tsdoc/syntax": "error",
        "@typescript-eslint/no-extra-semi": "off",
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
}
