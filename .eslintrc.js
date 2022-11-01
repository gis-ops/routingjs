export default {
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
}
