import { GraphHopper } from "./index"
import dotenv from 'dotenv'
dotenv.config()

describe("GraphHopper returns responses", () => {
    const g = new GraphHopper({ baseUrl: "http://localhost:8989" })
    it("gets a directions response", async () => {
        await g
            .directions(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
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
                    g.directions[0].feature.properties.duration
                ).not.toBeNull()

                expect(
                    g.directions[0].feature.properties.distance
                ).not.toBeNull()
            })
            .catch((e)=>{
                expect(e.properties).toBeDefined()
                expect(e.properties).toHaveProperty("status_code")
                expect(e.properties).toHaveProperty("status")
                expect(e.properties).toHaveProperty("message")
            })
    })

    it("gets an isochrones response", async () => {
        await g.reachability([42.51007, 1.53789], "car", [600])
        .then((i) => {
            expect(i.raw).toBeDefined()
            expect(i.isochrones).toHaveLength(1)
        })
        .catch((e)=>{
                expect(e.properties).toBeDefined()
                expect(e.properties).toHaveProperty("status_code")
                expect(e.properties).toHaveProperty("status")
                expect(e.properties).toHaveProperty("message")
        })
    })

    //optional
    if(process.env.GRAPHHOPPER_API_KEY){
        it("gets a matrix response", async () => {
        const g = new GraphHopper({
            apiKey: process.env.GRAPHHOPPER_API_KEY,
        })
        await g
            .matrix(
                [
                    [42.5063, 1.51886],
                    [42.51007, 1.53789],
                ],
                "car"
            )
            .then((m) => {
                expect(m).toHaveProperty("durations")
                expect(m).toHaveProperty("distances")
                expect(m.raw).toBeDefined()
            })
            .catch((e)=>{
                expect(e.properties).toBeDefined()
                expect(e.properties).toHaveProperty("status_code")
                expect(e.properties).toHaveProperty("status")
                expect(e.properties).toHaveProperty("message")
            })
        })
    }
})
