import { AxiosRequestConfig } from "axios"
import { Feature, FeatureCollection, LineString, Point, Polygon } from "geojson"
import Client from "client"
import { Direction, DirectionFeat, Directions } from "direction"
import Matrix from "matrix"
import options from "options"
import {
    MapboxAuthParams,
    ValhallaContours,
    ValhallaCostingOptsAuto,
    ValhallaCostingOptsBicycle,
    ValhallaCostingOptsMotorcycle,
    ValhallaCostingOptsPedestrian,
    ValhallaCostingOptsTruck,
    ValhallaCostingType,
    ValhallaDateTime,
    ValhallaDirectionsType,
    ValhallaIsochroneParams,
    ValhallaLocation,
    ValhallaMatrixParams,
    ValhallaMatrixResponse,
    ValhallaRequestUnit,
    ValhallaRouteParams,
    ValhallaRouteResponse,
} from "parameters/valhalla"
import { BaseRouter } from "."
import { decode } from "@googlemaps/polyline-codec"
import { Isochrone, Isochrones } from "isochrone"

interface ValhallaBaseOpts {
    id?: string
    preference?: "shortest" | "fastest"
    costingOpts?:
        | ValhallaCostingOptsAuto
        | ValhallaCostingOptsTruck
        | ValhallaCostingOptsBicycle
        | ValhallaCostingOptsMotorcycle
        | ValhallaCostingOptsPedestrian
    avoidLocations?: ([number, number] | Point | Feature<Point, any>)[]
    avoidPolygons?: ([number, number][][] | Polygon | Feature<Polygon, any>)[]
    dateTime?: ValhallaDateTime
}

interface ValhallaDirectionOpts extends ValhallaBaseOpts {
    instructions?: boolean
    alternatives?: number
    units?: ValhallaRequestUnit
    language?: string
    directionsType?: ValhallaDirectionsType
}

interface ValhallaIsochroneOpts extends ValhallaBaseOpts {
    intervalType?: "time" | "distance"
    colors?: string[]
    polygons?: boolean
    denoise?: number
    generalize?: number
    showLocations?: boolean
}

interface ValhallaMatrixOpts extends ValhallaBaseOpts {
    sources?: number[]
    destinations?: number[]
    units?: ValhallaRequestUnit
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

    public async directions(
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
        ) {
            params.costing_options = {
                [profile]: {
                    ...directionsOpts.costingOpts,
                    shortest: directionsOpts.preference ? true : undefined,
                },
            }
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

    public async isochrones(
        location: [number, number],
        profile: ValhallaCostingType,
        intervals: number[],
        isochronesOpts?: ValhallaIsochroneOpts,
        dryRun?: boolean
    ): Promise<Isochrones> {
        const auth: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = Valhalla.getIsochroneParams(
            location,
            profile,
            intervals,
            isochronesOpts
        )

        return this.client
            .request("/isochrone", undefined, params, auth, dryRun)
            .then((res) => {
                console.log(res)
                return Valhalla.parseIsochroneResponse(
                    res as FeatureCollection<Point | Polygon | LineString, any>,
                    location,
                    intervals,
                    isochronesOpts?.intervalType
                        ? isochronesOpts.intervalType
                        : "time"
                ) as Isochrones
            })
            .catch((error) => {
                console.log(error)
                return new Isochrones()
            })
    }

    public static getIsochroneParams(
        location: [number, number],
        profile: ValhallaCostingType,
        intervals: number[],
        isochroneOpts: ValhallaIsochroneOpts = {}
    ): ValhallaIsochroneParams {
        const contours: ValhallaContours[] = []
        let [key, divisor]: ["time" | "distance", 60 | 1000] =
            isochroneOpts.intervalType !== undefined &&
            isochroneOpts.intervalType === "distance"
                ? ["distance", 1000]
                : ["time", 60]

        intervals.forEach((interval, index) => {
            const contourObj: ValhallaContours = {
                [key]: interval / divisor,
            }

            if (isochroneOpts.colors !== undefined) {
                if (isochroneOpts.colors.length !== intervals.length) {
                    throw new Error(
                        "Colors array must be of same length as intervals array"
                    )
                }
                contourObj.color = isochroneOpts.colors[index]
            }
            contours.push(contourObj)
        })

        const params: ValhallaIsochroneParams = {
            locations: this._buildLocations(location),
            costing: profile,
            contours,
        }

        if (
            (isochroneOpts.costingOpts !== undefined &&
                Object.keys(isochroneOpts.costingOpts).length) ||
            isochroneOpts.preference !== undefined
        )
            params.costing_options = {
                [profile]: {
                    ...isochroneOpts.costingOpts,
                    shortest: isochroneOpts.preference ? true : undefined,
                },
            }

        if (isochroneOpts.avoidLocations) {
            const avoidLocations: [number, number][] = []
            isochroneOpts.avoidLocations.forEach((avoid_location) => {
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

        if (isochroneOpts.avoidPolygons) {
            const avoidPolygons: [number, number][][][] = []

            isochroneOpts.avoidPolygons.forEach((avoid_polygon) => {
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

        if (isochroneOpts.dateTime) {
            params.date_time = isochroneOpts.dateTime
        }

        if (isochroneOpts.id) {
            params.id = isochroneOpts.id
        }

        if (isochroneOpts.showLocations) {
            params.show_locations = isochroneOpts.showLocations
        }

        return params
    }

    public static parseIsochroneResponse(
        response: FeatureCollection<LineString | Polygon | Point, any>,
        location: [number, number],
        intervals: number[],
        intervalType: "time" | "distance"
    ): Isochrones {
        const isochrones: Isochrone[] = []

        response.features.forEach((feature, index) => {
            if (feature.geometry.type !== "Point") {
                isochrones.push(
                    new Isochrone(
                        location,
                        intervals[index],
                        intervalType,
                        feature
                    )
                )
            }
        })

        return new Isochrones(isochrones, response)
    }

    public async matrix(
        locations: [number, number][],
        profile: ValhallaCostingType,
        matrixOpts?: ValhallaMatrixOpts,
        dryRun: boolean = false
    ): Promise<Matrix | undefined> {
        const auth: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = Valhalla.getMatrixParams(locations, profile, matrixOpts)

        return this.client
            .request("/sources_to_targets", undefined, params, auth, dryRun)
            .then((res) => {
                return Valhalla.parseMatrixResponse(
                    res as ValhallaMatrixResponse,
                    matrixOpts?.units ? matrixOpts.units : "km"
                ) as Matrix
            })
            .catch((error) => {
                console.log(error)
                return new Matrix()
            })
    }

    public static getMatrixParams(
        locations: [number, number][],
        profile: ValhallaCostingType,
        matrixOpts: ValhallaMatrixOpts = {}
    ): ValhallaMatrixParams {
        const matrixLocations = Valhalla._buildLocations(locations)

        let sourceCoords = matrixLocations

        if (matrixOpts.sources) {
            sourceCoords = sourceCoords.filter((source, index) => {
                matrixOpts.sources?.includes(index)
            })
        }

        let destCoords = matrixLocations

        if (matrixOpts.destinations) {
            destCoords = destCoords.filter((source, index) => {
                matrixOpts.destinations?.includes(index)
            })
        }

        const params: ValhallaMatrixParams = {
            costing: profile,
            sources: sourceCoords,
            targets: destCoords,
        }

        if (
            (matrixOpts.costingOpts !== undefined &&
                Object.keys(matrixOpts.costingOpts).length) ||
            matrixOpts.preference !== undefined
        ) {
            params.costing_options = {
                [profile]: {
                    ...matrixOpts.costingOpts,
                    shortest: matrixOpts.preference ? true : undefined,
                },
            }
        }

        if (matrixOpts.avoidLocations) {
            const avoidLocations: [number, number][] = []
            matrixOpts.avoidLocations.forEach((avoid_location) => {
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

        if (matrixOpts.avoidPolygons) {
            const avoidPolygons: [number, number][][][] = []

            matrixOpts.avoidPolygons.forEach((avoid_polygon) => {
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

        if (matrixOpts.id) {
            params.id = matrixOpts.id
        }

        return params
    }

    public static parseMatrixResponse(
        response: ValhallaMatrixResponse,
        units: ValhallaRequestUnit
    ): Matrix {
        const factor = units === "miles" || units === "mi" ? 0.621371 : 1
        const durations = response.sources_to_targets?.map((origin) =>
            origin.map((dest) => dest.time)
        )
        const distances = response.sources_to_targets?.map((origin) =>
            origin.map((dest) => {
                if (dest.distance) {
                    return Math.round(dest.distance * 1000 * factor)
                } else {
                    return null
                }
            })
        )
        return new Matrix(durations, distances, response)
    }

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
