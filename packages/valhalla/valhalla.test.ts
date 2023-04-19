import { Valhalla } from "./index"

describe("Valhalla returns responses", () => {
    const v = new Valhalla({ baseUrl: "http://localhost:8002" })
    it("gets a directions response", async () => {
        await v
            .directions(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
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
                    d.directions[0].feature.properties.duration
                ).not.toBeNull()

                expect(
                    d.directions[0].feature.properties.distance
                ).not.toBeNull()
            })
            .catch((e) => {
                expect(e.properties).toBeDefined()
                expect(e.properties).toHaveProperty("status_code")
                expect(e.properties).toHaveProperty("status")
                expect(e.properties).toHaveProperty("error_code")
                expect(e.properties).toHaveProperty("error")
            })
    })

    it("gets an isochrone response", async () => {
        await v
            .reachability([42.50823, 1.52601], "pedestrian", [30, 90])
            .then((i) => {
                expect(i).toHaveProperty("isochrones")
                expect(i.isochrones).toHaveLength(2)
            })
            .catch((e) => {
                expect(e.properties).toBeDefined()
                expect(e.properties).toHaveProperty("status_code")
                expect(e.properties).toHaveProperty("status")
                expect(e.properties).toHaveProperty("error_code")
                expect(e.properties).toHaveProperty("error")
            })
    })

    it("gets an isochrone response with polygons", async () => {
        await v
            .reachability([42.50823, 1.52601], "pedestrian", [30, 90], {
                polygons: true,
                id: "test-id",
            })
            .then((i) => {
                expect(i).toHaveProperty("isochrones")
                expect(i.isochrones).toHaveLength(2)
                expect(["Polygon", "MultiPolygon"]).toContain(
                    i.isochrones[0].feature.geometry.type
                )
                expect(i.raw.id === "test-id")
            })
            .catch((e) => {
                expect(e.properties).toBeDefined()
                expect(e.properties).toHaveProperty("status_code")
                expect(e.properties).toHaveProperty("status")
                expect(e.properties).toHaveProperty("error_code")
                expect(e.properties).toHaveProperty("error")
            })
    })

    it("gets an matrix response", async () => {
        await v
            .matrix(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
                ],
                "auto"
            )
            .then((m) => {
                expect(m).toHaveProperty("durations")
                expect(m).toHaveProperty("distances")
                expect(m.durations).toHaveLength(2)
            })
            .catch((e) => {
                expect(e.properties).toBeDefined()
                expect(e.properties).toHaveProperty("status_code")
                expect(e.properties).toHaveProperty("status")
                expect(e.properties).toHaveProperty("error_code")
                expect(e.properties).toHaveProperty("error")
            })
    })
})
