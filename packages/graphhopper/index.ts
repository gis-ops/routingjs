import { decode } from "@googlemaps/polyline-codec"
import {
    BaseRouter,
    ClientConstructorArgs,
    Direction,
    Directions,
    Isochrone,
    RoutingJSAPIError,
    ErrorProps,
    Isochrones,
    Matrix,
    Client,
} from "@routingjs/core"
import { LineString } from "geojson"
import {
    GraphHopperIsochroneGetParams,
    GraphHopperIsochroneParams,
    GraphHopperIsochroneProps,
    GraphHopperIsochroneResponse,
    GraphHopperMatrixParams,
    GraphHopperMatrixResponse,
    GraphHopperProfile,
    GraphHopperRouteParams,
    GraphHopperRoutePath,
    GraphHopperRouteResponse,
} from "./parameters"
import { AxiosError } from "axios"

type GraphHopperHint = {
    message: string
    details?: string
    point_index?: number
}

type GraphHopperErrorResponseProps = {
    message: string
    hints: GraphHopperHint[]
}

export interface GraphHopperErrorProps extends ErrorProps {
    message: string | undefined
    hints: GraphHopperHint[]
}

const handleGHError = (error: AxiosError<GraphHopperErrorResponseProps>) => {
    const props: GraphHopperErrorProps = {
        status_code: error.response?.status,
        status: error.response?.statusText,
        message: error.response?.data.message,
        hints: error.response?.data.hints || [],
    }
    throw new RoutingJSAPIError<GraphHopperErrorProps>(error.message, props)
}

/**
 * `points` and `profile` properties are passed using the `directions()` method's top level args for
 * consistency.
 *
 */
export type GraphHopperDirectionsOpts = Omit<
    GraphHopperRouteParams,
    "points" | "profile"
>

/** Omitted properties are passed using the `.matrix()` top level function arguments for consistency. */
type GraphHopperMatrixBaseOpts = Omit<
    GraphHopperMatrixParams,
    "from_points" | "to_points" | "profile"
>

export interface GraphHopperMatrixOpts extends GraphHopperMatrixBaseOpts {
    /**  */
    sources?: number[]
    destinations?: number[]
}

export interface GraphHopperIsochroneOpts
    extends Omit<
        GraphHopperIsochroneParams,
        "point" | "profile" | "time_limit" | "distance_limit"
    > {
    interval_type?: "time" | "distance"
}

/**
 * Performs requests to the  GraphHopper API. Default public URL is
 * https://graphhopper.com/api/1.
 *
 * For the full documentation, see  {@link https://docs.graphhopper.com}.
 */
export class GraphHopper implements BaseRouter {
    client: Client<
        | GraphHopperRouteResponse
        | GraphHopperIsochroneResponse
        | GraphHopperMatrixResponse,
        | {
              [k in keyof GraphHopperIsochroneGetParams]: GraphHopperIsochroneGetParams[k]
          }
        | { key?: string }, // for auth
        GraphHopperRouteParams | GraphHopperMatrixParams
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
        this.apiKey = apiKey
        const defaultURL = "https://graphhopper.com/api/1"

        if (baseUrl === undefined && !apiKey) {
            throw new Error(
                "Please provide an API key for GraphHopper"
            )
        }

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
     * Get directions between two or more points. For the complete documentation, please see {@link https://docs.graphhopper.com/#operation/postRoute}.
     *
     * @param locations - coordinate tuples in lat/lon format
     * @param profile - one of {@link GraphHopperProfile}
     * @param directionsOpts - optional parameters that are passed to the route endpoint. See {@link GraphHopperDirectionsOpts}
     * @param dryRun - if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging
     */
    directions(
        locations: [number, number][],
        profile: GraphHopperProfile,
        directionsOpts?: GraphHopperDirectionsOpts,
        dryRun?: false
    ): Promise<Directions<GraphHopperRouteResponse, GraphHopperRoutePath>>
    directions(
        locations: [number, number][],
        profile: GraphHopperProfile,
        directionsOpts: GraphHopperDirectionsOpts,
        dryRun: true
    ): Promise<string>
    public async directions(
        locations: [number, number][],
        profile: GraphHopperProfile,
        directionsOpts?: GraphHopperDirectionsOpts,
        dryRun?: boolean | undefined
    ): Promise<
        string | Directions<GraphHopperRouteResponse, GraphHopperRoutePath>
    > {
        const params: GraphHopperRouteParams = {
            profile,
            points: locations.map(([lat, lon]) => [lon, lat]),
            ...directionsOpts,
        }

        if (
            directionsOpts?.custom_model ||
            directionsOpts?.headings ||
            directionsOpts?.heading_penalty ||
            directionsOpts?.pass_through ||
            directionsOpts?.algorithm ||
            directionsOpts?.["round_trip.distance"] ||
            directionsOpts?.["round_trip.seed"] ||
            directionsOpts?.["alternative_route.max_paths"] ||
            directionsOpts?.["alternative_route.max_share_factor"] ||
            directionsOpts?.["alternative_route.max_weight_factor"]
        ) {
            params["ch.disable"] = true // automatically detects whether contraction hierarchies need to be disabled
        }
        return this.client
            .request({
                endpoint: `/route${this.apiKey ? "?key=" + this.apiKey : ""}`,
                postParams: params,
                dryRun,
            })
            .then((res: GraphHopperRouteResponse) => {
                if (typeof res === "object") {
                    return GraphHopper.parseDirectionsResponse(res)
                } else {
                    return res
                }
            })
            .catch((error) => handleGHError(error))
    }
    /**
     * Parse a response object returned from the `/route` endpoint and returns an {@link Isochrone } object.
     *
     * @param response - the response from the server
     * @returns a new {@link Directions} object
     */
    public static parseDirectionsResponse(
        response: GraphHopperRouteResponse
    ): Directions<GraphHopperRouteResponse, GraphHopperRoutePath> {
        return new Directions(
            response.paths.map((path) => {
                let geometry = path.points

                if (path.points_encoded) {
                    geometry = {
                        type: "LineString",
                        coordinates: decode(path.points as string, 5).map(
                            ([lat, lon]) => [lon, lat]
                        ) as [number, number][],
                    }
                }

                return new Direction(
                    {
                        type: "Feature",
                        geometry: geometry as LineString,
                        properties: {
                            duration: path.time,
                            distance: path.distance,
                        },
                    },
                    path
                )
            }),
            response
        )
    }

    /**
     * Gets isochrones or equidistants for a range of time/distance values around a given set of coordinates.
     *
     * @param location - One coordinate pair denoting the location. Format: [lat, lon]
     * @param profile - Specifies the mode of transport.
     * @param intervals - Maximum range to calculate distances/durations for. You can also specify the `buckets` variable to break the single value into more isochrones. For compatibility reasons, this parameter is expressed as list. In meters or seconds depending on `interval_type`.
     * @param isochronesOpts - additional options specific to the isochrone endpoint.
     * @param dryRun - if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging
     *
     * @see {@link https://docs.graphhopper.com/#tag/Isochrone-API} for the full documentation.
     */
    reachability(
        location: [number, number],
        profile: GraphHopperProfile,
        intervals: [number],
        isochronesOpts?: GraphHopperIsochroneOpts,
        dryRun?: false
    ): Promise<
        Isochrones<GraphHopperIsochroneResponse, GraphHopperIsochroneProps>
    >
    reachability(
        location: [number, number],
        profile: GraphHopperProfile,
        intervals: [number],
        isochronesOpts: GraphHopperIsochroneOpts,
        dryRun: true
    ): Promise<string>
    public async reachability(
        location: [number, number],
        profile: GraphHopperProfile,
        intervals: [number],
        isochronesOpts?: GraphHopperIsochroneOpts,
        dryRun?: boolean | undefined
    ): Promise<
        | string
        | Isochrones<GraphHopperIsochroneResponse, GraphHopperIsochroneProps>
    > {
        const params: GraphHopperIsochroneGetParams = {
            point: location.join(","),
            profile,
        }

        const interval = intervals[0].toString()
        if (isochronesOpts?.interval_type === "distance") {
            params.distance_limit = interval
        } else {
            params.time_limit = interval
        }

        if (isochronesOpts?.buckets !== undefined) {
            params.buckets = isochronesOpts.buckets.toString()
        }

        if (isochronesOpts?.reverse_flow !== undefined) {
            params.reverse_flow = isochronesOpts.reverse_flow ? "true" : "false"
        }

        return this.client
            .request({
                endpoint: `/isochrone`,
                getParams: { ...params, key: this.apiKey },
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return GraphHopper.parseIsochroneResponse(
                        res as GraphHopperIsochroneResponse,
                        location,
                        isochronesOpts?.interval_type || "time"
                    )
                } else {
                    return res
                }
            })
            .catch((error) => handleGHError(error))
    }

    /**
     * Parses a response returned from the `/isochrone` endpoint and returns an {@link Isochrones} object.
     *
     * @param response - a graphhopper isochrone response
     * @param center - the originally requested location
     * @param intervalType - whether isodistances or isochrones were requested
     * @returns a new Isochrones instance
     */
    public static parseIsochroneResponse(
        response: GraphHopperIsochroneResponse,
        center: [number, number],
        intervalType: "time" | "distance"
    ): Isochrones<GraphHopperIsochroneResponse, GraphHopperIsochroneProps> {
        const isochrones: Isochrone<GraphHopperIsochroneProps>[] =
            response.polygons.map((poly) => {
                return new Isochrone(
                    center,
                    poly.properties.bucket,
                    intervalType,
                    poly
                )
            })
        return new Isochrones(isochrones, response)
    }

    /**
     * Makes a request to the `/matrix` endpoint.
     *
     * @remarks
     *
     * Currently not available on the open source version.
     *
     * @param locations - Specify multiple points for which the weight-, route-, time- or
     *                    distance-matrix should be calculated. In this case the starts are identical
     *                    to the destinations.
     *                    If there are N points, then NxN entries will be calculated. Format: [lat, lon]
     * @param profile - Specifies the mode of transport.
     * @param matrixOpts - additional options specific to the matrix endpoint
     * @param dryRun - if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging
     *
     * @see {@link https://docs.graphhopper.com/#tag/Matrix-API} for the full documentation.
     *
     */
    matrix(
        locations: [number, number][],
        profile: GraphHopperProfile,
        matrixOpts?: GraphHopperMatrixOpts,
        dryRun?: false
    ): Promise<Matrix<GraphHopperMatrixResponse>>
    matrix(
        locations: [number, number][],
        profile: GraphHopperProfile,
        matrixOpts: GraphHopperMatrixOpts,
        dryRun: true
    ): Promise<string>
    public async matrix(
        locations: [number, number][],
        profile: GraphHopperProfile,
        matrixOpts?: GraphHopperMatrixOpts,
        dryRun?: boolean | undefined
    ): Promise<Matrix<GraphHopperMatrixResponse> | string> {
        const params: GraphHopperMatrixParams = {
            profile,
            from_points: locations
                .filter((coords, i) => {
                    if (matrixOpts?.sources !== undefined) {
                        return matrixOpts.sources.includes(i)
                    } else return true
                })
                .map(([lat, lon]) => [lon, lat]), // reverse order for POST requests

            to_points: locations
                .filter((coords, i) => {
                    if (matrixOpts?.destinations !== undefined) {
                        return matrixOpts.destinations.includes(i)
                    } else return true
                })
                .map(([lat, lon]) => [lon, lat]),
            ...matrixOpts,
        }

        return this.client
            .request({
                endpoint: `/matrix${this.apiKey ? "?key=" + this.apiKey : ""}`,
                postParams: params,
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return GraphHopper.parseMatrixResponse(
                        res as GraphHopperMatrixResponse
                    ) as Matrix<GraphHopperMatrixResponse>
                } else {
                    return res
                }
            })
            .catch((error) => handleGHError(error))
    }

    /**
     * Parse a response returned from the `/matrix` endpoint.
     *
     * @param response - a GraphHopper Matrix response
     * @returns a new Matrix instance
     */
    public static parseMatrixResponse(
        response: GraphHopperMatrixResponse
    ): Matrix<GraphHopperMatrixResponse> {
        return new Matrix(
            response.times || [[]],
            response.distances || [[]],
            response
        )
    }
}

export * from "./parameters"
