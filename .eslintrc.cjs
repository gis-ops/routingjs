module.exports = {
    parser: "@typescript-eslint/parser",

    overrides: [
        {
            files: ["*.ts"],
            parserOptions: {
                project: "./tsconfig.eslint.json",
                ecmaVersion: 2020,
                tsconfigRootDir: __dirname,
                sourceType: "module",
            },
            rules: {
                "tsdoc/syntax": "warn",
                "@typescript-eslint/no-extra-semi": "off",
            },
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended",
            ],
        },
    ],
    env: {
        node: true,
        es6: true,
    },
    plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
}
