import { Feature, FeatureCollection, LineString, Point, Polygon } from "geojson"
import {
    Client,
    Direction,
    DirectionFeat,
    Directions,
    Isochrone,
    Isochrones,
    Matrix,
    BaseRouter,
    ClientConstructorArgs,
} from "@routingjs/core"
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
    ValhallaIsochroneResponse,
    ValhallaLocation,
    ValhallaMatrixParams,
    ValhallaMatrixResponse,
    ValhallaRequestUnit,
    ValhallaRouteParams,
    ValhallaRouteResponse,
} from "./parameters"
import { decode } from "@googlemaps/polyline-codec"

interface ValhallaBaseOpts {
    /** A request ID that will be returned in the response */
    id?: string
    /**
     * Convenience argument to set the cost metric, one of ['shortest', 'fastest']. Note,
            that shortest is not guaranteed to be absolute shortest for motor vehicle profiles. It's called ``preference``
            to be in line with the already existing parameter in the ORS adapter.
     */
    preference?: "shortest" | "fastest"
    /**
     * Profiles can have several options that can be adjusted to develop the route path,
            as well as for estimating time along the path. Only specify the actual options dict, the profile
            will be filled automatically. For more information, visit:
            https://github.com/valhalla/valhalla/blob/master/docs/api/turn-by-turn/api-reference.md#costing-options
     */
    costingOpts?:
        | ValhallaCostingOptsAuto
        | ValhallaCostingOptsTruck
        | ValhallaCostingOptsBicycle
        | ValhallaCostingOptsMotorcycle
        | ValhallaCostingOptsPedestrian
    /**
     * A set of locations to exclude or avoid within a route.
     */
    avoidLocations?: ([number, number] | Point | Feature<Point>)[]
    /**
     * Roads intersecting these polygons
            will be avoided during path finding. If you only need to avoid a few specific roads, it's much more
            efficient to use avoid_locations. Valhalla will close open rings (i.e. copy the first coordingate to the
            last position).
     */
    avoidPolygons?: ([number, number][][] | Polygon | Feature<Polygon>)[]
    /**
     * This is the local date and time at the location. Field `type`: 0: Current departure time,
       1: Specified departure time. Field `value`: the date and time is specified
       in ISO 8601 format (YYYY-MM-DDThh:mm), local time.

        @example
        ```js
        date_time = {type: 0, value: 2021-03-03T08:06:23}
        ```
     */
    dateTime?: ValhallaDateTime
}

export interface ValhallaDirectionOpts extends ValhallaBaseOpts {
    /**
     * Whether to return turn-by-turn instructions. Named for compatibility with other
     *  providers. Valhalla's parameter here is 'narrative'.
     */
    instructions?: boolean
    /** A number denoting how many alternate routes should be provided.
     * There may be no alternates or less alternates than the user specifies.
     *  Alternates are not yet supported on multipoint routes (that is, routes with
     * more than 2 locations). They are also not supported on time dependent routes.
     */
    alternatives?: number
    /**
     * Distance units for output. Allowable unit types are miles (or mi) and kilometers (or km).
     * If no unit type is specified, the units default to kilometers.
     */
    units?: ValhallaRequestUnit
    /**
     * The language of the narration instructions based on the IETF BCP 47 language tag string.
     * If no language is specified or the specified language is unsupported, United States-based
     * English (en-US) is used.
     *
     * See here for a list of supported languages: {@link https://valhalla.readthedocs.io/en/latest/api/turn-by-turn/api-reference/#supported-language-tags}
     */
    language?: string
    /**
     * 'none': no instructions are returned. 'maneuvers': only maneuvers are returned.
     * 'instructions': maneuvers with instructions are returned. Default 'instructions'
     */
    directionsType?: ValhallaDirectionsType
}

export interface ValhallaIsochroneOpts extends ValhallaBaseOpts {
    /**
     * Set 'time' for isochrones or 'distance' for equidistants.
     * Default 'time'.
     */
    intervalType?: "time" | "distance"
    /**
     * The color for the output of the contour. Specify it as a Hex value, but without the #, such as
     * "color":"ff0000" for red. If no color is specified, the isochrone service will assign a default color to the output.
     */
    colors?: string[]
    /**
     * Controls whether polygons or linestrings are returned in GeoJSON geometry. Default False.
     */
    polygons?: boolean
    /**
     * Can be used to remove smaller contours. In range [0, 1]. A value of 1 will only return the largest contour
     * for a given time value. A value of 0.5 drops any contours that are less than half the area of the largest
     * contour in the set of contours for that same time value. Default 1.
     */
    denoise?: number
    /**
     * A floating point value in meters used as the tolerance for Douglas-Peucker generalization.
     * Note: Generalization of contours can lead to self-intersections, as well as intersections of adjacent contours.
     */
    generalize?: number
    /**
     * A boolean indicating whether the input locations should be returned as MultiPoint features: one feature for the exact input coordinates and one feature
     * for the coordinates of the network node it snapped to. Default false.
     */
    showLocations?: boolean
}

export interface ValhallaMatrixOpts extends ValhallaBaseOpts {
    sources?: number[]
    destinations?: number[]
    units?: ValhallaRequestUnit
}

export class Valhalla implements BaseRouter {
    client: Client<
        ValhallaRouteResponse | ValhallaMatrixResponse | FeatureCollection,
        MapboxAuthParams,
        ValhallaIsochroneParams | ValhallaRouteParams | ValhallaMatrixParams
    >
    apiKey?: string
    constructor(clientArgs?: ClientConstructorArgs) {
        const {
            apiKey,
            baseUrl,
            userAgent,
            headers,
            timeout,
            retryOverQueryLimit,
            maxRetries,
            axiosOpts,
        } = clientArgs || {}

        this.apiKey = apiKey // TODO: add to requests

        const defaultURL = "https://valhalla1.openstreetmap.de"

        this.client = new Client(
            baseUrl || defaultURL,
            userAgent,
            timeout,
            retryOverQueryLimit,
            headers,
            maxRetries,
            axiosOpts
        )
    }

    /**
     * Makes a request to Valhalla's `/route` endpoint.
     *
     * @param locations - The coordinates tuple the route should be calculated from in order of visit. Format: [lat, lon]
     * @param profile - Specifies the mode of transport
     * @param directionsOpts - Additional parameters, such as costing options.
     * @param dryRun - if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging
     * @see {@link ValhallaCostingType} for available profiles
     */
    public async directions(
        locations: [number, number][],
        profile: ValhallaCostingType,
        directionsOpts?: ValhallaDirectionOpts,
        dryRun?: false
    ): Promise<Directions<ValhallaRouteResponse, ValhallaRouteResponse>>
    public async directions(
        locations: [number, number][],
        profile: ValhallaCostingType,
        directionsOpts: ValhallaDirectionOpts,
        dryRun: true
    ): Promise<string>
    public async directions(
        locations: [number, number][],
        profile: ValhallaCostingType,
        directionsOpts: ValhallaDirectionOpts = {},
        dryRun = false
    ): Promise<
        Directions<ValhallaRouteResponse, ValhallaRouteResponse> | string
    > {
        dryRun = dryRun || false
        const getParams: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = this.getDirectionParams(
            locations,
            profile,
            directionsOpts
        )

        return this.client
            .request({
                endpoint: "/route",
                postParams: params,
                getParams,
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return this.parseDirectionsResponse(
                        res as ValhallaRouteResponse,
                        "main"
                    )
                } else {
                    return res // return the request info string
                }
            })
            .catch((error) => {
                throw error.properties ? error.properties : error.message
            })
    }

    protected getDirectionParams(
        locations: [number, number][],
        profile: ValhallaCostingType,
        directionsOpts: ValhallaDirectionOpts = {}
    ): ValhallaRouteParams {
        const params: ValhallaRouteParams = {
            locations: this._buildLocations(locations),
            costing: profile,
            narrative: directionsOpts.instructions || false,
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
                // TODO: convert to loop
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
                // TODO: convert to loop
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

    parseDirectionsResponse(
        response: ValhallaRouteResponse,
        type: "main"
    ): Directions<ValhallaRouteResponse, ValhallaRouteResponse>
    parseDirectionsResponse(
        response: ValhallaRouteResponse,
        type: "alternative"
    ): Direction<ValhallaRouteResponse>
    public parseDirectionsResponse(
        response: ValhallaRouteResponse,
        type: "main" | "alternative" = "main"
    ):
        | Directions<ValhallaRouteResponse, ValhallaRouteResponse>
        | Direction<ValhallaRouteResponse> {
        const geometry: [number, number][] = []
        let [duration, distance] = [0, 0]
        let factor = 1
        if (response.trip?.units) {
            factor = ["mi", "miles"].includes(response.trip?.units)
                ? 0.621371
                : 1
        }

        response.trip?.legs?.forEach((leg) => {
            // TODO: convert to loop
            if (leg.shape) {
                geometry.push(
                    ...(decode(leg.shape, 6).map(([lat, lon]) => [
                        lon,
                        lat,
                    ]) as [number, number][])
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
            const directions: Direction<ValhallaRouteResponse>[] =
                response.alternates
                    ? response.alternates.map((res) => {
                          return this.parseDirectionsResponse(
                              res,
                              "alternative"
                          )
                      })
                    : []

            return new Directions(
                [new Direction(feat, response), ...directions],
                response
            )
        } else {
            return new Direction(feat, response)
        }
    }
    /**
     * Makes a request to Valhalla's `/isochrone` endpoint.
     *
     * @param location - The coordinates tuple that represents the starting location. Format: [lat, lon]
     * @param profile - Specifies the mode of transport
     * @param isochronesOpts - Additional parameters, such as costing options.
     * @param dryRun - if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging
     * @see {@link ValhallaCostingType} for available profiles
     */
    public async reachability(
        location: [number, number],
        profile: ValhallaCostingType,
        intervals: number[],
        isochronesOpts?: ValhallaIsochroneOpts,
        dryRun?: false
    ): Promise<Isochrones<ValhallaIsochroneResponse, Feature>>
    public async reachability(
        location: [number, number],
        profile: ValhallaCostingType,
        intervals: number[],
        isochronesOpts: ValhallaIsochroneOpts,
        dryRun: true
    ): Promise<string>
    public async reachability(
        location: [number, number],
        profile: ValhallaCostingType,
        intervals: number[],
        isochronesOpts: ValhallaIsochroneOpts = {},
        dryRun?: boolean
    ): Promise<Isochrones<ValhallaIsochroneResponse, Feature> | string> {
        const getParams: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = this.getIsochroneParams(
            location,
            profile,
            intervals,
            isochronesOpts
        )

        return this.client
            .request({
                endpoint: "/isochrone",
                postParams: params,
                getParams,
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return Valhalla.parseIsochroneResponse(
                        res as ValhallaIsochroneResponse,
                        location,
                        intervals,
                        isochronesOpts?.intervalType
                            ? isochronesOpts.intervalType
                            : "time"
                    ) as Isochrones<ValhallaIsochroneResponse, Feature>
                } else {
                    return res // return the request info string
                }
            })
            .catch((error) => {
                throw error.properties ? error.properties : error.message
            })
    }

    public getIsochroneParams(
        location: [number, number],
        profile: ValhallaCostingType,
        intervals: number[],
        isochroneOpts: ValhallaIsochroneOpts = {}
    ): ValhallaIsochroneParams {
        const contours: ValhallaContours[] = []
        const [key, divisor]: ["time" | "distance", 60 | 1000] =
            isochroneOpts.intervalType !== undefined &&
            isochroneOpts.intervalType === "distance"
                ? ["distance", 1000]
                : ["time", 60]

        intervals.forEach((interval, index) => {
            // TODO: convert to loop
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
            polygons: isochroneOpts.polygons,
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
                // TODO: convert to loop
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
                // TODO: convert to loop
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
        response: ValhallaIsochroneResponse,
        location: [number, number],
        intervals: number[],
        intervalType: "time" | "distance"
    ): Isochrones<ValhallaIsochroneResponse, Feature> {
        const isochrones: Isochrone<Feature>[] = []
        response.features.forEach((feature, index) => {
            // TODO: convert to loop
            if (feature.geometry.type !== "Point") {
                isochrones.push(
                    new Isochrone(
                        location,
                        intervals[index],
                        intervalType,
                        feature as Feature<LineString | Polygon, any>
                    )
                )
            }
        })

        return new Isochrones(isochrones, response)
    }

    /**
     * Makes a request to Valhalla's `/matrix` endpoint.
     *
     * @param locations - Format: [lat, lon]
     * @param profile - Specifies the mode of transport
     * @param matrixOpts - Additional parameters, such as costing options.
     * @param dryRun - if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging
     * @see {@link ValhallaCostingType} for available profiles
     */
    public async matrix(
        locations: [number, number][],
        profile: ValhallaCostingType,
        matrixOpts?: ValhallaMatrixOpts,
        dryRun?: false
    ): Promise<Matrix<ValhallaMatrixResponse>>
    public async matrix(
        locations: [number, number][],
        profile: ValhallaCostingType,
        matrixOpts: ValhallaMatrixOpts,
        dryRun: true
    ): Promise<string>
    public async matrix(
        locations: [number, number][],
        profile: ValhallaCostingType,
        matrixOpts: ValhallaMatrixOpts = {},
        dryRun?: boolean
    ): Promise<Matrix<ValhallaMatrixResponse> | string> {
        const getParams: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = this.getMatrixParams(locations, profile, matrixOpts)

        return this.client
            .request({
                endpoint: "/sources_to_targets",
                postParams: params,
                getParams,
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return Valhalla.parseMatrixResponse(
                        res as ValhallaMatrixResponse,
                        matrixOpts?.units ? matrixOpts.units : "km"
                    ) as Matrix<ValhallaMatrixResponse>
                } else {
                    return res // return the request info string
                }
            })
            .catch((error) => {
                throw error.properties ? error.properties : error.message
            })
    }

    public getMatrixParams(
        locations: [number, number][],
        profile: ValhallaCostingType,
        matrixOpts: ValhallaMatrixOpts = {}
    ): ValhallaMatrixParams {
        const matrixLocations = this._buildLocations(locations)

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
                // TODO: convert to loop
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
                // TODO: convert to loop
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
    ): Matrix<ValhallaMatrixResponse> {
        const factor = units === "miles" || units === "mi" ? 0.621371 : 1
        const durations = response.sources_to_targets.map((origin) =>
            origin.map((dest) => dest.time)
        )
        const distances = response.sources_to_targets.map((origin) =>
            origin.map((dest) => {
                if (dest.distance !== undefined && dest.distance !== null) {
                    return Math.round(dest.distance * 1000 * factor)
                } else {
                    return null
                }
            })
        )
        return new Matrix(durations, distances, response)
    }

    protected _buildLocations(
        coordinates: [number, number][]
    ): ValhallaLocation[]
    protected _buildLocations(coordinates: [number, number]): [ValhallaLocation]
    protected _buildLocations(
        coordinates: [number, number][] | [number, number]
    ): ValhallaLocation[] {
        if (Array.isArray(coordinates[0])) {
            const locations: ValhallaLocation[] = []
            ;(coordinates as number[][]).forEach((coordPair) => {
                // TODO: convert to loop
                const locObj = { lon: coordPair[1], lat: coordPair[0] }
                locations.push(locObj)
            })
            return locations
        } else {
            const location: [ValhallaLocation] = [
                {
                    lat: (coordinates as number[])[0],
                    lon: (coordinates as number[])[1],
                },
            ]
            return location
        }
    }
}

export * from "./parameters"
