import { OSRM } from "./index"
import { RoutingJSAPIError, assertError, CommonErrorProps } from "@routingjs/core"

describe("OSRM returns responses", () => {
    const o = new OSRM({ baseUrl: "http://localhost:5000" })
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
            .catch((e: RoutingJSAPIError<CommonErrorProps>) => assertError(e))
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
            .catch((e: RoutingJSAPIError<CommonErrorProps>) => assertError(e))
    })
})
