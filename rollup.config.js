import typescript from "@rollup/plugin-typescript"
import * as path from "path"

import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [".", "valhalla", "osrm", "ors", "graphhopper"].map((pkg) => {
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
        plugins: [typescript()],
    }
})
