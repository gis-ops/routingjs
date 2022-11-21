import { decode } from "@googlemaps/polyline-codec"
import { AxiosRequestConfig } from "axios"
import { BaseRouter } from "BaseRouter"
import Client from "Client"
import { Direction, Directions } from "Direction"
import { RoutingJSError } from "error"
import { LineString } from "geojson"
import {
    GraphHopperIsochroneGetParams,
    GraphHopperIsochroneParams,
    GraphHopperIsochroneResponse,
    GraphHopperMatrixParams,
    GraphHopperMatrixResponse,
    GraphHopperProfile,
    GraphHopperRouteParams,
    GraphHopperRouteResponse,
} from "graphhopper/parameters"
import { Isochrone, Isochrones } from "Isochrone"
import Matrix from "Matrix"
import options from "options"

export type GraphHopperDirectionsOpts = Omit<
    GraphHopperRouteParams,
    "points" | "profile"
>

export interface GraphHopperMatrixOpts
    extends Omit<
        GraphHopperMatrixParams,
        "from_points" | "to_points" | "profile"
    > {
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

class GraphHopper implements BaseRouter {
    client: Client

    constructor(
        public readonly apiKey?: string,
        public readonly baseUrl: string = "https://graphhopper.com/api/1",
        public readonly userAgent?: string,
        public readonly headers?: { [k: string]: string },
        public readonly timeout: number = options.defaultTimeout,
        public readonly retryOverQueryLimit: boolean = false,
        public readonly maxRetries: number = options.defaultMaxRetries,
        public readonly skipApiError: boolean = false,
        protected readonly axiosOpts?: AxiosRequestConfig
    ) {
        if (baseUrl === "https://api.openrouteservice.org" && !apiKey) {
            throw new RoutingJSError("Please provide an API key for ORS")
        }

        this.client = new Client(
            baseUrl,
            userAgent,
            timeout,
            retryOverQueryLimit,
            headers,
            maxRetries,
            skipApiError,
            axiosOpts
        )
    }
    directions(
        locations: [number, number][],
        profile: GraphHopperProfile,
        directionsOpts?: GraphHopperDirectionsOpts,
        dryRun?: false
    ): Promise<Directions<GraphHopperRouteResponse>>
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
    ): Promise<string | Directions<GraphHopperRouteResponse>> {
        const params: GraphHopperRouteParams = {
            profile,
            points: locations, //.map(([lat, lon]) => [lon, lat]), // reverse order for POST requests
            ...directionsOpts,
        }

        return this.client
            .request(
                `/route${this.apiKey ? "?key=" + this.apiKey : ""}`,
                undefined,
                params,
                undefined,
                dryRun
            )
            .then((res) => {
                if (typeof res === "object") {
                    return GraphHopper.parseDirectionsResponse(
                        res as GraphHopperRouteResponse
                    ) as Directions<GraphHopperRouteResponse>
                } else {
                    return res
                }
            })
    }

    public static parseDirectionsResponse(
        response: GraphHopperRouteResponse
    ): Directions<GraphHopperRouteResponse> {
        return new Directions(
            response.paths.map((path) => {
                let geometry = path.points

                if (path.points_encoded) {
                    geometry = {
                        type: "LineString",
                        coordinates: decode(path.points as string, 5) as [
                            number,
                            number
                        ][],
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

    isochrones(
        location: [number, number],
        profile: GraphHopperProfile,
        intervals: [number],
        isochronesOpts?: GraphHopperIsochroneOpts,
        dryRun?: false
    ): Promise<Isochrones<GraphHopperIsochroneResponse>>
    isochrones(
        location: [number, number],
        profile: GraphHopperProfile,
        intervals: [number],
        isochronesOpts: GraphHopperIsochroneOpts,
        dryRun: true
    ): Promise<string>
    public async isochrones(
        location: [number, number],
        profile: GraphHopperProfile,
        intervals: [number],
        isochronesOpts?: GraphHopperIsochroneOpts,
        dryRun?: boolean | undefined
    ): Promise<string | Isochrones<Record<string, any>>> {
        let params: GraphHopperIsochroneGetParams = {
            point: [location[1], location[0]].join(","),
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
            .request(
                `/isochrone`,
                { ...params, key: this.apiKey },
                undefined,
                undefined,
                dryRun
            )
            .then((res) => {
                if (typeof res === "object") {
                    return GraphHopper.parseIsochroneResponse(
                        res as GraphHopperIsochroneResponse,
                        location,
                        isochronesOpts?.interval_type || "time"
                    ) as Isochrones<GraphHopperIsochroneResponse>
                } else {
                    return res
                }
            })
    }

    public static parseIsochroneResponse(
        response: GraphHopperIsochroneResponse,
        center: [number, number],
        intervalType: "time" | "distance"
    ): Isochrones<GraphHopperIsochroneResponse> {
        return new Isochrones(
            response.polygons.map((poly) => {
                return new Isochrone(
                    center,
                    poly.properties.bucket,
                    intervalType,
                    poly
                )
            }),
            response
        )
    }

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
            .request(
                `/matrix${this.apiKey ? "?key=" + this.apiKey : ""}`,
                undefined,
                params,
                undefined,
                dryRun
            )
            .then((res) => {
                if (typeof res === "object") {
                    return GraphHopper.parseMatrixResponse(
                        res as GraphHopperMatrixResponse
                    ) as Matrix<GraphHopperMatrixResponse>
                } else {
                    return res
                }
            })
    }

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

export default GraphHopper
