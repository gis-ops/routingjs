import OSRM from "."

describe("OSRM returns responses", () => {
    it("gets a direction response", async () => {
        const o = new OSRM({ baseUrl: "http://localhost:5000" })
        await o
            .directions(
                [
                    [1.51886, 42.5063],
                    [1.53789, 42.51007],
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
                    [1.51886, 42.5063],
                    [1.53789, 42.51007],
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
