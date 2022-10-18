import Valhalla from "../routers/valhalla"
describe("Valhalla returns responses", () => {
    it("gets a directions response", async () => {
        const v = new Valhalla("http://valhalla1.openstreetmap.de")
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
})
