import ORS from "."

describe("OSRM returns responses", () => {
    it("gets a direction response", async () => {
        const ors = new ORS(
            "5b3ce3597851110001cf6248d07a51fd10134409b8e747119cb1c294"
        )

        await ors
            .directions(
                [
                    [1.51886, 42.5063],
                    [1.53789, 42.51007],
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

    it("gets an isochrone response", async () => {
        const ors = new ORS(
            "5b3ce3597851110001cf6248d07a51fd10134409b8e747119cb1c294"
        )

        await ors
            .isochrones([1.51886, 42.5063], "driving-car", [150, 300])
            .then((i) => {
                expect(i.isochrones).toHaveLength(2)
            })
    })
})
