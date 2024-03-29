// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "RoutingJS Documentation",
    tagline: "Consistent access to Open Source Routing Engines",
    url: "https://gis-ops.github.io/",
    trailingSlash: false,
    baseUrl: "/routingjs",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "gis-ops", // Usually your GitHub org/user name.
    projectName: "routingjs", // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: "https://github.com/gis-ops/routingjs/",
                },
                blog: false,
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: "RoutingJS",

                items: [
                    { to: "/docs/api", label: "docs" },
                    {
                        href: "https://github.com/gis-ops/routingjs",
                        label: "GitHub",
                        position: "right",
                    },
                ],
            },
            footer: {
                style: "dark",
                links: [
                    {
                        title: "Docs",
                        items: [
                            {
                                label: "Quickstart",
                                to: "/docs/quickstart",
                            },
                            {
                                label: "Docs",
                                to: "/docs/api/",
                            },
                        ],
                    },
                    {
                        title: "Community",
                        items: [
                            {
                                label: "Twitter",
                                href: "https://twitter.com/gis_ops",
                            },
                            {
                                label: "LinkedIn",
                                href: "https://linkedin.com/gis-ops",
                            },
                        ],
                    },
                    {
                        title: "More",
                        items: [
                            {
                                label: "GIS-OPS",
                                href: "https://gis-ops.com",
                            },
                            {
                                label: "GitHub",
                                href: "https://github.com/gis-ops/routingjs",
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} GIS-OPS UG. Icons by <a href="https://tabler-icons.io">tabler</a>.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
    plugins: [
        [
            "docusaurus-plugin-typedoc",

            {
                entryPoints: [
                    "../packages/core/index.ts",
                    "../packages/valhalla/index.ts",
                    "../packages/osrm/index.ts",
                    "../packages/ors/index.ts",
                    "../packages/graphhopper/index.ts",
                ],
                tsconfig: "../tsconfig.doc.json",
            },
        ],
    ],
}

module.exports = config
