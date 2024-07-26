import { Feature, FeatureCollection, LineString, Point, Polygon } from "geojson"
import {
    Client,
    Direction,
    DirectionFeat,
    Directions,
    Isochrone,
    RoutingJSAPIError,
    Isochrones,
    Matrix,
    BaseRouter,
    ClientConstructorArgs,
    ErrorProps,
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
    ValhallaShapeMatch,
    ValhallaTraceRouteParams,
} from "./parameters"
import { decode } from "@googlemaps/polyline-codec"
import { AxiosError } from "axios"

type ValhallaErrorResponseProps = {
    status_code: number
    status: string
    error_code: number
    error: string
}

/**
 * `ValhallaErrorProps` returns additional information about the error thrown by the
 *  Valhalla routing engine. It sends back the status_code, status, error_code and error
 *  message where the error_code is specific to Valhalla.
 */
export interface ValhallaErrorProps extends ErrorProps {
    errorCode?: number
}

export type ValhallaAPIError = RoutingJSAPIError<ValhallaErrorProps>

const handleValhallaError = (error: AxiosError<ValhallaErrorResponseProps>) => {
    const props: ValhallaErrorProps = {
        statusCode: error.response?.status,
        status: error.response?.statusText,
        errorCode: error.response?.data.error_code,
        errorMessage: error.response?.data.error,
    }
    throw new RoutingJSAPIError<ValhallaErrorProps>(error.message, props)
}

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

interface ValhallaAdditionalTraceOpts {
    /** Search radius in meters associated with supplied trace points. */
    searchRadius?: number
    /** GPS accuracy in meters associated with supplied trace points. */
    gpsAccuracy?: number
    /** Breaking distance in meters between trace points.  */
    breakageDistance?: number
    /** Interpolation distance in meters beyond which trace points are merged together. */
    interpolationDistance?: number
    /**
     * When present and true, the successful trace_route response will include a key
     * linear_references. Its value is an array of base64-encoded [OpenLR](https://www.openlr-association.com/fileadmin/user_upload/openlr-whitepaper_v1.5.pdf) location
     * references, one for each graph edge of the road network matched by the input trace.
     *
     */
    linearReferences?: boolean
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

export interface ValhallaTraceRouteOpts
    extends Omit<ValhallaBaseOpts, "avoidLocations" | "avoidPolygons"> {
    /**
     * shape_match is an optional string input parameter. It allows some control
     * of the matching algorithm based on the type of input.
     *
     * @remarks
     * `edge_walk`:    Indicates an edge walking algorithm can be used. This algorithm
     *                 requires nearly exact shape matching, so it should only be used
     *                 when the shape is from a prior Valhalla route.
     *
     * `map_snap`: 	   Indicates that a map-matching algorithm should be used because
     *                 the input shape might not closely match Valhalla edges. This
     *                 algorithm is more expensive.
     *
     * `walk_or_snap`: Also the default option. This will try edge walking and if this
     *                 does not succeed, it will fall back and use map matching.
     *
     * @defaultValue
     * `walk_or_snap`
     */
    shapeMatch?: ValhallaShapeMatch
    /**
     * Begin timestamp for the trace.
     *
     * @remarks
     * This is used along with the durations so that timestamps can be specified for a
     * trace that is specified using an encoded polyline.
     */
    beginTime?: string
    /**
     * List of durations (seconds) between each successive pair of input trace points.
     *
     * @remarks
     * This allows trace points to be supplied as an encoded polyline and timestamps to be
     * created by using this list of "delta" times along with the begin_time of the trace.
     */
    durations?: number[]
    /**
     * A boolean value indicating whether the input timestamps or durations should be used
     * when computing elapsed time at each edge along the matched path.
     *
     * @remarks
     * If true, timestamps are used. If false (default), internal costing is applied to
     * compute elapsed times.
     *
     * @defaultValue
     * `false`
     */
    useTimestamps?: boolean
    /** Additional Options */
    traceOptions?: ValhallaAdditionalTraceOpts
    directionsOptions?: ValhallaDirectionOpts
}

export type ValhallaDirections = Directions<
    ValhallaRouteResponse,
    ValhallaRouteResponse
>

export type ValhallaIsochrones = Isochrones<ValhallaIsochroneResponse, Feature>

export type ValhallaMatrix = Matrix<ValhallaMatrixResponse>

export type ValhallaTraceRoute = Directions<
    ValhallaRouteResponse,
    ValhallaRouteResponse
>

export type ValhallaClient = Client<
    ValhallaRouteResponse | ValhallaMatrixResponse | FeatureCollection,
    MapboxAuthParams,
    | ValhallaIsochroneParams
    | ValhallaRouteParams
    | ValhallaMatrixParams
    | ValhallaTraceRouteParams
>

export class Valhalla implements BaseRouter<ValhallaLocation> {
    client: ValhallaClient
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
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        directionsOpts?: ValhallaDirectionOpts,
        dryRun?: false
    ): Promise<ValhallaDirections>
    public async directions(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        directionsOpts: ValhallaDirectionOpts,
        dryRun: true
    ): Promise<string>
    public async directions(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        directionsOpts: ValhallaDirectionOpts = {},
        dryRun = false
    ): Promise<ValhallaDirections | string> {
        dryRun = dryRun || false
        const getParams: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = Valhalla.getDirectionParams(
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
            .catch(handleValhallaError)
    }

    public static getDirectionParams(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        directionsOpts: ValhallaDirectionOpts = {}
    ): ValhallaRouteParams {
        const params: ValhallaRouteParams = {
            locations: Valhalla._buildLocations(locations),
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
            params.exclude_locations = this._buildLocations(avoidLocations);
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
    ): ValhallaDirections
    parseDirectionsResponse(
        response: ValhallaRouteResponse,
        type: "alternative"
    ): Direction<ValhallaRouteResponse>
    public parseDirectionsResponse(
        response: ValhallaRouteResponse,
        type: "main" | "alternative" = "main"
    ): ValhallaDirections | Direction<ValhallaRouteResponse> {
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
        location: [number, number] | ValhallaLocation,
        profile: ValhallaCostingType,
        intervals: number[],
        isochronesOpts?: ValhallaIsochroneOpts,
        dryRun?: false
    ): Promise<ValhallaIsochrones>
    public async reachability(
        location: [number, number] | ValhallaLocation,
        profile: ValhallaCostingType,
        intervals: number[],
        isochronesOpts: ValhallaIsochroneOpts,
        dryRun: true
    ): Promise<string>
    public async reachability(
        location: [number, number] | ValhallaLocation,
        profile: ValhallaCostingType,
        intervals: number[],
        isochronesOpts: ValhallaIsochroneOpts = {},
        dryRun?: boolean
    ): Promise<ValhallaIsochrones | string> {
        const getParams: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = Valhalla.getIsochroneParams(
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
                    ) as ValhallaIsochrones
                } else {
                    return res // return the request info string
                }
            })
            .catch(handleValhallaError)
    }

    public static getIsochroneParams(
        location: [number, number] | ValhallaLocation,
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
            locations: Valhalla._buildLocations(location),
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
        location: [number, number] | ValhallaLocation,
        intervals: number[],
        intervalType: "time" | "distance"
    ): ValhallaIsochrones {
        const isochrones: Isochrone<Feature>[] = []
        response.features.forEach((feature, index) => {
            if (feature.geometry.type !== "Point") {
                isochrones.push(
                    new Isochrone(
                        Array.isArray(location)
                            ? location
                            : [location.lat, location.lon],
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
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        matrixOpts?: ValhallaMatrixOpts,
        dryRun?: false
    ): Promise<ValhallaMatrix>
    public async matrix(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        matrixOpts: ValhallaMatrixOpts,
        dryRun: true
    ): Promise<string>
    public async matrix(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        matrixOpts: ValhallaMatrixOpts = {},
        dryRun?: boolean
    ): Promise<ValhallaMatrix | string> {
        const getParams: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = Valhalla.getMatrixParams(locations, profile, matrixOpts)

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
                    ) as ValhallaMatrix
                } else {
                    return res // return the request info string
                }
            })
            .catch(handleValhallaError)
    }

    public static getMatrixParams(
        locations: ([number, number] | ValhallaLocation)[],
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
    ): ValhallaMatrix {
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

    /**
     * Makes a request to Valhalla's `/trace_route` endpoint.
     *
     * @param locations - Format: [lat, lon]
     * @param profile - Specifies the mode of transport
     * @param mapMatchOpts - Additional parameters, such as costing options.
     * @param dryRun - if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging
     * @see {@link ValhallaCostingType} for available profiles
     */
    public async mapMatch(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        mapMatchOpts?: ValhallaTraceRouteOpts,
        dryRun?: false
    ): Promise<ValhallaDirections>
    public async mapMatch(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        mapMatchOpts: ValhallaTraceRouteOpts,
        dryRun: true
    ): Promise<string>
    public async mapMatch(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        traceRouteOpts: ValhallaTraceRouteOpts = {},
        dryRun?: boolean
    ): Promise<ValhallaDirections | string> {
        const getParams: MapboxAuthParams | undefined = this.apiKey
            ? { access_token: this.apiKey }
            : undefined
        const params = Valhalla.getTraceRouteParams(
            locations,
            profile,
            traceRouteOpts
        )

        return this.client
            .request({
                endpoint: "/trace_route",
                postParams: params,
                getParams,
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return this.parseDirectionsResponse(
                        res as ValhallaRouteResponse,
                        "main"
                    ) as ValhallaDirections
                } else {
                    return res // return the request info string
                }
            })
            .catch(handleValhallaError)
    }

    public static getTraceRouteParams(
        locations: ([number, number] | ValhallaLocation)[],
        profile: ValhallaCostingType,
        traceRouteOpts: ValhallaTraceRouteOpts = {}
    ): ValhallaTraceRouteParams {
        const params: ValhallaTraceRouteParams = {
            shape: this._buildLocations(locations),
            costing: profile,
        }

        if (
            traceRouteOpts.costingOpts !== undefined &&
            Object.keys(traceRouteOpts.costingOpts).length
        ) {
            params.costing_options = {
                [profile]: {
                    ...traceRouteOpts.costingOpts,
                },
            }
        }

        params.shape_match = traceRouteOpts.shapeMatch
        params.begin_time = traceRouteOpts.beginTime
        params.durations = traceRouteOpts.durations
        params.use_timestamps = traceRouteOpts.useTimestamps

        if (traceRouteOpts.traceOptions) {
            params.trace_options = {
                gps_accuracy: traceRouteOpts.traceOptions.gpsAccuracy,
                breakage_distance: traceRouteOpts.traceOptions.breakageDistance,
                search_radius: traceRouteOpts.traceOptions.searchRadius,
                interpolation_distance:
                    traceRouteOpts.traceOptions.interpolationDistance,
            }
        }

        params.directions_options = {
            language: traceRouteOpts.directionsOptions?.language,
            units: traceRouteOpts.directionsOptions?.units,
            directions_type: traceRouteOpts.directionsOptions?.directionsType,
        }

        params.id = traceRouteOpts.id

        return params
    }

    public static _buildLocations(
        coordinates:
            | ([number, number] | ValhallaLocation)[]
            | [number, number]
            | ValhallaLocation
    ): ValhallaLocation[]
    public static _buildLocations(
        coordinates:
            | ([number, number] | ValhallaLocation)[]
            | [number, number]
            | ValhallaLocation
    ): [ValhallaLocation]
    public static _buildLocations(
        coordinates:
            | ([number, number] | ValhallaLocation)[]
            | [number, number]
            | ValhallaLocation
    ): ValhallaLocation[] {
        if (Array.isArray(coordinates)) {
            if (Array.isArray(coordinates[0])) {
                // [[lat, long], [lat, long], ...]
                const locations: ValhallaLocation[] = []
                ;(coordinates as number[][]).forEach((coordPair) => {
                    const locObj = { lon: coordPair[1], lat: coordPair[0] }
                    locations.push(locObj)
                })
                return locations
            } else {
                if (typeof coordinates[0] == "number") {
                    // [lat, lng]
                    const location: [ValhallaLocation] = [
                        {
                            lat: (coordinates as [number, number])[0],
                            lon: (coordinates as [number, number])[1],
                        },
                    ]
                    return location
                } else {
                    // location objects
                    return coordinates as ValhallaLocation[]
                }
            }
        } else {
            // single location obj
            return [coordinates]
        }
    }
}

export * from "./parameters"
