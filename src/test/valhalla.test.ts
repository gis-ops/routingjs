import Valhalla from "../valhalla"

describe("Valhalla returns responses", () => {
    it("gets a directions response", async () => {
        const v = new Valhalla("http://localhost:8002")
        await v
            .directions(
                [
                    [1.51886, 42.5063],
                    [1.53789, 42.51007],
                ],
                "pedestrian"
            )
            .then((d) => {
                expect(d.raw).toBeDefined()
                expect(d.directions).toHaveLength(1)
                expect(d.directions[0]).toHaveProperty("feature")
                expect(d.directions[0].feature).toHaveProperty("geometry")
                expect(d.directions[0].feature.geometry).toHaveProperty(
                    "coordinates"
                )

                expect(
                    d.directions[0].feature.properties!.duration
                ).not.toBeNull()

                expect(
                    d.directions[0].feature.properties!.distance
                ).not.toBeNull()
            })
    })

    it("gets an isochrone response", async () => {
        const v = new Valhalla()
        await v.isochrones([1.51886, 42.5063], "auto", [15, 20]).then((i) => {
            expect(i).toHaveProperty("isochrones")
            expect(i.isochrones).toHaveLength(2)
        })
    })

    it("gets an matrix response", async () => {
        const v = new Valhalla()
        await v
            .matrix(
                [
                    [1.51886, 42.5063],
                    [1.53789, 42.51007],
                ],
                "auto"
            )
            .then((m) => {
                expect(m).toHaveProperty("durations")
                expect(m).toHaveProperty("distances")
                expect(m.durations).toHaveLength(2)
            })
    })
})
