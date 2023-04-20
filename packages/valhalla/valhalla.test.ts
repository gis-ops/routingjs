import { Valhalla } from "./index"
import { assertError } from "../../util/error"

const v = new Valhalla({ baseUrl: "http://localhost:8002" })

describe("Valhalla returns responses", () => {
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
    })

    it("gets an isochrone response", async () => {
        await v
            .reachability([42.50823, 1.52601], "pedestrian", [30, 90])
            .then((i) => {
                expect(i).toHaveProperty("isochrones")
                expect(i.isochrones).toHaveLength(2)
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
    })
})

describe("Throws RoutingJSAPIError", () => {
    it("fails to get a directions response", async () => {
        await v
            .directions(
                [
                    [0.00001, 1],
                    [42.51007, 1.53789],
                ],
                "pedestrian"
            )
            .catch(assertError)
    })

    it("fails to get an isochrone response", async () => {
        await v
            .reachability([0.00001, 1], "pedestrian", [30, 90])
            .catch(assertError)
    })

    it("fails to get an isochrone response with polygons", async () => {
        await v
            .reachability([0.00001, 1], "pedestrian", [30, 90], {
                polygons: true,
                id: "test-id",
            })
            .catch(assertError)
    })

    it("fails to get a matrix response", async () => {
        await v
            .matrix(
                [
                    [0.00001, 1],
                    [42.51007, 1.53789],
                ],
                "auto"
            )
            .catch(assertError)
    })
})
