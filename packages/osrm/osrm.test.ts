import { OSRM } from "./index"

describe("OSRM returns responses", () => {
    it("gets a direction response", async () => {
        const o = new OSRM({ baseUrl: "http://localhost:5000" })
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
        const o = new OSRM({ baseUrl: "http://localhost:5000" })
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
