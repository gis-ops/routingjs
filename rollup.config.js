import typescript from "@rollup/plugin-typescript"
import * as path from "path"

import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const packages = [".", "valhalla", "osrm", "ors", "graphhopper"]
export default packages.map((pkg, i) => {
    // prevent typescript from generating type definitions for not required packages
    // (i.e. OSRM type definitions for the Valhalla package)
    const excludePattern =
        pkg === "."
            ? []
            : [
                  `./src/(${packages
                      .filter((p, ix) => i != ix)
                      .slice(1) // exclude root
                      .join("|")})/*.ts+(|x)`,
              ]

    const base = path.join(__dirname, "src", pkg)
    const outputFile =
        pkg === "." ? path.join(base, "..", "dist") : path.join(base, "dist")
    return {
        input: path.join(base, "index.ts"),
        output: [
            {
                file: path.join(outputFile, "index.cjs"),
                format: "cjs",
            },
            {
                file: path.join(outputFile, "index.js"),
                format: "es",
            },
        ],
        plugins: [
            typescript({
                tsconfig: path.join(__dirname, "tsconfig.json"),
                compilerOptions: {
                    baseUrl: base,
                },
                exclude: [
                    "node_modules",
                    "dist",
                    "**/*.test.ts",
                    ...excludePattern,
                ],
            }),
        ],
    }
})
