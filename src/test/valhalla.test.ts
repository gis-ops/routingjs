import Valhalla from "../routers/valhalla"

describe("Valhalla returns responses", () => {
    it("gets a directions response", async () => {
        const v = new Valhalla()
        await v
            .directions(
                [
                    [8.512516, 47.380742],
                    [8.557835, 47.359467],
                ],
                "auto"
                //true
            )
            .then((d) => {
                console.log(d)
                if (d !== undefined) {
                    expect(d).toHaveProperty("directions")
                    expect(d.directions).toHaveLength(1)
                    if (d.directions !== undefined) {
                        expect(d.directions[0]).toHaveProperty("feature")

                        if (d.directions[0].feature !== undefined) {
                            expect(d.directions[0].feature).toHaveProperty(
                                "geometry"
                            )
                            expect(
                                d.directions[0].feature.geometry
                            ).toHaveProperty("coordinates")
                            expect(
                                d.directions[0].feature.geometry.coordinates
                                    .length
                            ).toBeGreaterThan(0)
                        }
                    }
                }
            })
    })

    it("gets an isochrone response", async () => {
        const v = new Valhalla()
        await v
            .isochrones(
                [8.512516, 47.380742],
                "auto",
                [15, 20],
                undefined,
                false
            )
            .then((i) => {
                console.log(i)
                if (i !== undefined) {
                    expect(i).toHaveProperty("isochrones")
                    expect(i.isochrones).toHaveLength(2)
                }
            })
    })

    it("gets an matrix response", async () => {
        const v = new Valhalla()
        await v
            .matrix(
                [
                    [8.512516, 47.380742],
                    [8.557835, 47.359467],
                ],
                "auto"
            )
            .then((m) => {
                console.log(m)
                if (m !== undefined) {
                    expect(m).toHaveProperty("durations")
                    expect(m).toHaveProperty("distances")
                    expect(m.durations).toHaveLength(2)
                }
            })
    })
})
