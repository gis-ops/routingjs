module.exports = {
    parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    env: {
        node: true,
        es6: true,
    },
}
