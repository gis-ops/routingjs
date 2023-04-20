import { OSRM } from "./index"
import { assertError } from "../../util/error"

const o = new OSRM({ baseUrl: "http://localhost:5000" })

describe("OSRM returns responses", () => {
    it("gets a direction response", async () => {
        await o
            .directions(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
                ],
                "driving",
                { radiuses: [1000, 1000] }
            )
            .then((d) => {
                expect(d).toHaveProperty("directions")
                expect(d.directions.length).toBeGreaterThan(0)
            })
    })

    it("gets a matrix response", async () => {
        await o
            .matrix(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
                ],
                "driving",
                { radiuses: [1000, 1000] },
                false
            )
            .then((m) => {
                expect(m).toHaveProperty("durations")
                expect(m.durations.length).toBeGreaterThan(0)
            })
    })
})

describe("Throws RoutingJSAPIError", () => {
    it("fails to get a direction response", async () => {
        await o
            .directions(
                [
                    [0.00001, 1],
                    [42.51007, 1.53789],
                ],
                "driving",
                { radiuses: [1000, 1000] }
            )
            .catch((e) => assertError(e))
    })

    it("fails to get a matrix response", async () => {
        await o
            .matrix(
                [
                    [0.00001, 1],
                    [42.51007, 1.53789],
                ],
                "driving",
                { radiuses: [1000, 1000] },
                false
            )
            .catch((e) => assertError(e))
    })
})
