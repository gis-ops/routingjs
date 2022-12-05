import { ORS } from "./index"

describe("ORS returns responses", () => {
    it("gets a direction response", async () => {
        const ors = new ORS({
            baseUrl: "http://localhost:8080/ors",
        })

        await ors
            .directions(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
                ],
                "driving-car"
            )
            .then((d) => {
                expect(d.directions).toHaveLength(1)
                expect(d.directions[0].feature.geometry).toHaveProperty(
                    "coordinates"
                )
            })
    })

    it("gets a direction response from geojson endpoint", async () => {
        const ors = new ORS({
            baseUrl: "http://localhost:8080/ors",
        })

        await ors
            .directions(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
                ],
                "driving-car",
                {},
                false,
                "geojson"
            )
            .then((d) => {
                expect(d.directions).toHaveLength(1)
                expect(d.directions[0].feature.geometry).toHaveProperty(
                    "coordinates"
                )
            })
    })

    it("gets an isochrone response", async () => {
        const ors = new ORS({
            baseUrl: "http://localhost:8080/ors",
        })

        await ors
            .reachability([42.5063, 1.51886], "driving-car", [150, 300])
            .then((i) => {
                expect(i.isochrones).toHaveLength(2)
            })
    })

    it("gets a matrix response", async () => {
        const ors = new ORS({
            baseUrl: "http://localhost:8080/ors",
        })

        await ors
            .matrix(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
                ],
                "driving-car",
                { metrics: ["distance", "duration"] }
            )
            .then((m) => {
                expect(m.distances).toBeDefined()
                expect(m.distances).toHaveLength(2)
                expect(m.durations).toBeDefined()
                expect(m.durations).toHaveLength(2)
            })
    })
})
