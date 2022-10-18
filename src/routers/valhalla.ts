import { AxiosRequestConfig } from "axios"
import { Feature, Point, Polygon } from "geojson"
import Client from "client"
import { Direction, DirectionFeat, Directions } from "direction"
import Matrix from "matrix"
import options from "options"
import {
    MapboxAuthParams,
    ValhallaCostingOptsAuto,
    ValhallaCostingOptsBicycle,
    ValhallaCostingOptsMotorcycle,
    ValhallaCostingOptsPedestrian,
    ValhallaCostingOptsTruck,
    ValhallaCostingType,
    ValhallaDateTime,
    ValhallaDirectionsType,
    ValhallaLocation,
    ValhallaRequestUnit,
    ValhallaRouteParams,
    ValhallaRouteResponse,
} from "parameters/valhalla"
import { BaseRouter } from "."
import { decode } from "@googlemaps/polyline-codec"

interface ValhallaDirectionOpts {
    id?: string
    preference?: "shortest" | "fastest"
    costingOpts?:
        | ValhallaCostingOptsAuto
        | ValhallaCostingOptsTruck
        | ValhallaCostingOptsBicycle
        | ValhallaCostingOptsMotorcycle
        | ValhallaCostingOptsPedestrian
    units?: ValhallaRequestUnit
    instructions?: boolean
    language?: string
    directionsType?: ValhallaDirectionsType
    avoidLocations?: ([number, number] | Point | Feature<Point, any>)[]
    avoidPolygons?: ([number, number][][] | Polygon | Feature<Polygon, any>)[]
    alternatives?: number
    dateTime?: ValhallaDateTime
}

class Valhalla implements BaseRouter {
    client: Client
    constructor(
        public readonly baseUrl: string,
        public readonly apiKey?: string,
        public readonly userAgent?: string,
        public readonly timeout: number = options.defaultTimeout,
        public readonly retryOverQueryLimit: boolean = false,
        public readonly maxRetries: number = options.defaultMaxRetries,
        public readonly skipApiError: boolean = false,
        protected readonly axiosOpts?: AxiosRequestConfig
    ) {
        this.client = new Client(
            baseUrl,
            userAgent,
            timeout,
            retryOverQueryLimit,
            maxRetries,
            skipApiError,
            axiosOpts
        )
    }

    public directions(
        locations: [number, number][],
        profile: ValhallaCostingType,
        directionsOpts?: ValhallaDirectionOpts,
        dryRun: boolean = false
    ): Promise<Directions | undefined> {
        const auth: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = Valhalla.getDirectionParams(
            locations,
            profile,
            directionsOpts
        )

        return this.client
            .request("/route", undefined, params, auth, dryRun)
            .then((res) => {
                console.log(res)
                return Valhalla.parseDirectionsResponse(
                    res as ValhallaRouteResponse
                ) as Directions
            })
            .catch((error) => {
                console.log(error)
                return new Directions()
            })
    }

    protected static getDirectionParams(
        locations: [number, number][],
        profile: ValhallaCostingType,
        directionsOpts: ValhallaDirectionOpts = {}
    ): ValhallaRouteParams {
        const params: ValhallaRouteParams = {
            locations: this._buildLocations(locations),
            costing: profile,
            narrative: directionsOpts.instructions,
        }

        if (
            (directionsOpts.costingOpts !== undefined &&
                Object.keys(directionsOpts.costingOpts).length) ||
            directionsOpts.preference !== undefined
        )
            params.costing_options = {
                [profile]: {
                    ...directionsOpts.costingOpts,
                    shortest: directionsOpts.preference ? true : undefined,
                },
            }

        if (
            directionsOpts.language ||
            directionsOpts.units ||
            directionsOpts.directionsType
        ) {
            params.directions_options = {
                language: directionsOpts.language,
                units: directionsOpts.units,
                directions_type: directionsOpts.directionsType,
            }
        }

        if (directionsOpts.avoidLocations) {
            const avoidLocations: [number, number][] = []
            directionsOpts.avoidLocations.forEach((avoid_location) => {
                if (Array.isArray(avoid_location)) {
                    avoidLocations.push(avoid_location)
                } else if (avoid_location.type === "Feature") {
                    // GeoJSON Position object can have elevation coordinate
                    avoidLocations.push([
                        avoid_location.geometry.coordinates[0],
                        avoid_location.geometry.coordinates[1],
                    ])
                } else {
                    // geometry obj only
                    avoidLocations.push([
                        avoid_location.coordinates[0],
                        avoid_location.coordinates[1],
                    ])
                }
            })
            params.exclude_locations = avoidLocations
        }

        if (directionsOpts.avoidPolygons) {
            const avoidPolygons: [number, number][][][] = []

            directionsOpts.avoidPolygons.forEach((avoid_polygon) => {
                if (Array.isArray(avoid_polygon)) {
                    avoidPolygons.push(avoid_polygon)
                } else if (avoid_polygon.type === "Feature") {
                    const outerRing: [number, number][][] =
                        avoid_polygon.geometry.coordinates.map((ring) => {
                            return ring.map((pos) => {
                                return [pos[0], pos[1]] // strip possible elevation
                            })
                        })
                    avoidPolygons.push(outerRing)
                }
                params.exclude_polygons = avoidPolygons
            })
        }

        if (directionsOpts.dateTime) {
            params.date_time = directionsOpts.dateTime
        }

        if (directionsOpts.id) {
            params.id = directionsOpts.id
        }

        if (directionsOpts.alternatives) {
            params.alternates = directionsOpts.alternatives
        }

        return params
    }

    public static parseDirectionsResponse(
        response: ValhallaRouteResponse,
        type: "main" | "alternative" = "main"
    ): Directions | Direction {
        console.log(response)
        const geometry: [number, number][] = []
        let [duration, distance] = [0, 0]
        let factor = 1
        if (response.trip?.units) {
            factor = ["mi", "miles"].includes(response.trip?.units)
                ? 0.621371
                : 1
        }

        response.trip?.legs?.forEach((leg) => {
            if (leg.shape) {
                geometry.push(
                    ...(decode(leg.shape, 6) as unknown as [number, number][])
                )
            }

            if (leg.summary.length) {
                distance += leg.summary.length * factor
            }

            if (leg.summary.time) {
                duration += leg.summary.time
            }
        })

        const feat: DirectionFeat = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: geometry,
            },
            properties: { distance, duration },
        }

        if (type === "main") {
            const directions: Direction[] = []
            response.alternates?.map((res) => {
                return this.parseDirectionsResponse(res, "alternative")
            })
            return new Directions([
                new Direction(feat, response),
                ...directions,
            ])
        } else {
            return new Direction(feat, response)
        }
    }

    public matrix: (
        locations: number[][],
        profile: string,
        matrixOpts: { [k: string]: any },
        dryRun: boolean
    ) => Promise<Matrix>

    protected static _buildLocations(
        coordinates: [number, number][] | [number, number]
    ): ValhallaLocation[] {
        const locations = []

        if (Array.isArray(coordinates[0])) {
            ;(coordinates as number[][]).forEach((coordPair) => {
                const locObj = { lat: coordPair[0], lon: coordPair[1] }
                locations.push(locObj)
            })
        } else {
            const locObj = {
                lat: coordinates[0],
                lon: (coordinates as number[])[1],
            }
            locations.push(locObj)
        }

        return locations
    }
}

export default Valhalla
