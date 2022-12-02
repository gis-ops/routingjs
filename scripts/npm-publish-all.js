#!/usr/bin/env node

import * as path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
import { spawnSync } from "child_process"
// const glob = require("glob")
// const { spawnSync } = require("child_process")
;[".", "valhalla", "osrm", "ors", "graphhopper"].forEach((pkg) => {
    const base = path.join(__dirname, "..", "src", pkg)
    const outputDirectory = pkg === "." ? path.join(base, "..") : base

    const log = spawnSync("npm", ["install", ".", "-g"], {
        encoding: "utf8",
        cwd: outputDirectory,
    })
    console.log(log.stdout)
    console.log(log.stderr)
})

// glob.sync(path.join(__dirname, "..", "src", "", "index.ts")).forEach(
//     (filepath) => {
//         const { dir } = path.parse(filepath)
//         const log = spawnSync("npm", ["install", ".", "-g"], {
//             encoding: "utf8",
//             cwd: dir,
//         })
//         console.log(log.stdout.trim())
//     }
// )
