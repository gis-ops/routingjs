import GraphHopper from "./index"

describe("GraphHopper returns responses", () => {
    it("gets a directions response", async () => {
        const g = new GraphHopper(undefined, "http://localhost:8989")
        await g
            .directions(
                [
                    [1.51886, 42.5063],
                    [1.53789, 42.51007],
                ],
                "car"
            )
            .then((g) => {
                expect(g.raw).toBeDefined()
                expect(g.directions).toHaveLength(1)
                expect(g.directions[0]).toHaveProperty("feature")
                expect(g.directions[0].feature).toHaveProperty("geometry")
                expect(g.directions[0].feature.geometry).toHaveProperty(
                    "coordinates"
                )

                expect(
                    g.directions[0].feature.properties!.duration
                ).not.toBeNull()

                expect(
                    g.directions[0].feature.properties!.distance
                ).not.toBeNull()
            })
    })

    it("gets an isocrones response", async () => {
        const g = new GraphHopper(undefined, "http://localhost:8989")
        await g.isochrones([1.53789, 42.51007], "car", [600]).then((i) => {
            console.log(i)
            expect(i.raw).toBeDefined()
            expect(i.isochrones).toHaveLength(1)
            // expect(i.isochrones[0].feature.properties.buckets).toBeDefined()
        })
    })
})
