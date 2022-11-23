import { AxiosRequestConfig } from "axios"
import Client from "../Client"
import { Direction, Directions } from "../Direction"
import { RoutingJSError } from "error"
import { DirectionFeat } from "../Direction"
import options from "options"
import {
    ORSAlternateRouteParam,
    ORSAttribute,
    ORSExtraInfo,
    ORSFormat,
    ORSInstructionFormat,
    ORSIsoAttribute,
    ORSIsochroneParams,
    ORSIsochroneResponse,
    ORSMatrixParams,
    ORSMatrixResponse,
    ORSPreference,
    ORSProfile,
    ORSRouteParams,
    ORSRouteResponse,
    ORSUnit,
} from "./parameters"
import { BaseRouter } from "../BaseRouter"
import { decode } from "@googlemaps/polyline-codec"
import Matrix from "../Matrix"
import { Isochrone, Isochrones } from "Isochrone"

interface ORSBaseOpts {
    units?: ORSUnit
}

export interface ORSDirectionsOpts extends ORSBaseOpts {
    preference?: ORSPreference
    alternative_routes?: ORSAlternateRouteParam
    language?: string
    geometry?: boolean
    geometry_simplify?: boolean
    instructions?: boolean
    instructions_format?: ORSInstructionFormat
    roundabout_exits?: boolean
    attributes?: ORSAttribute[]
    maneuvers?: boolean
    radiuses?: number[]
    bearings?: [number, number][]
    continue_straight?: boolean
    elevation?: boolean
    extra_info?: ORSExtraInfo[]
    suppress_warnings?: boolean
    options?: object
}

export interface ORSMatrixOpts extends ORSBaseOpts {
    metrics?: ("distance" | "duration")[]
    resolve_locations?: boolean
}

export interface ORSIsochroneOpts extends ORSBaseOpts {
    interval_type?: "time" | "distance"
    location_type?: "start" | "destination"
    smoothing?: number
    attributes?: ORSIsoAttribute[]
    intersections?: boolean
}

class ORS implements BaseRouter {
    client: Client
    constructor(
        public readonly apiKey?: string, // FIXME change signature to args obj
        public readonly baseUrl: string = "https://api.openrouteservice.org",
        public readonly userAgent?: string,
        public readonly headers?: { [k: string]: string },
        public readonly timeout: number = options.defaultTimeout,
        public readonly retryOverQueryLimit: boolean = false,
        public readonly maxRetries: number = options.defaultMaxRetries,
        protected readonly axiosOpts?: AxiosRequestConfig
    ) {
        if (baseUrl === "https://api.openrouteservice.org" && !apiKey) {
            throw new RoutingJSError("Please provide an API key for ORS")
        }

        if (apiKey) {
            headers = { ...headers, Authorization: apiKey }
        }

        this.client = new Client(
            baseUrl,
            userAgent,
            timeout,
            retryOverQueryLimit,
            headers,
            maxRetries,
            axiosOpts
        )
    }
    directions(
        locations: [number, number][],
        profile: ORSProfile,
        directionsOpts?: ORSDirectionsOpts,
        dryRun?: false,
        format?: ORSFormat
    ): Promise<Directions<ORSRouteResponse>>
    directions(
        locations: [number, number][],
        profile: ORSProfile,
        directionsOpts: ORSDirectionsOpts,
        dryRun: true,
        format?: ORSFormat
    ): Promise<string>
    public async directions(
        locations: [number, number][],
        profile: ORSProfile,
        directionsOpts: ORSDirectionsOpts = {},
        dryRun?: boolean,
        format: ORSFormat = "json"
    ): Promise<Directions<ORSRouteResponse> | string> {
        if (typeof directionsOpts.options === "object") {
            if (
                Object.prototype.hasOwnProperty.call(
                    directionsOpts.options,
                    "restrictions"
                ) &&
                !Object.prototype.hasOwnProperty.call(
                    directionsOpts.options,
                    "vehicle_type"
                )
            ) {
                throw new RoutingJSError(
                    "ORS: options.vehicle_type must be specified for driving-hgv if restrictions are set."
                )
            }
        }

        const params: ORSRouteParams = {
            coordinates: locations,
            ...directionsOpts,
        }

        return this.client
            .request({
                endpoint: `/v2/directions/${profile}/${format}`,
                postParams: params,
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return ORS.parseDirectionsResponse(
                        res as ORSRouteResponse,
                        format,
                        directionsOpts.units || "m"
                    ) as Directions<ORSRouteResponse>
                } else {
                    return res
                }
            })
    }

    public static parseDirectionsResponse(
        response: ORSRouteResponse,
        format: ORSFormat,
        units?: ORSUnit,
        alternative_routes?: ORSAlternateRouteParam
    ): Directions<ORSRouteResponse> {
        let factor = 1

        if (units === "km") {
            factor = 1000
        }

        if (units === "mi") {
            factor = 0.621371 * 1000
        }

        if (format === "geojson") {
            const routes: Direction[] = []
            response.features?.forEach((feature) => {
                feature.properties = {
                    ...feature.properties,
                    ...{
                        duration: feature.properties.summary.duration,
                        distance: feature.properties.summary.distance * factor,
                    },
                }
                routes.push(new Direction(feature))
            })

            return new Directions(routes, response)
        } else {
            // format is json
            const routes: Direction[] = []
            response.routes?.forEach((route) => {
                let geom = null
                if (route.geometry) {
                    geom = decode(route.geometry, 5)
                }

                const feat: DirectionFeat = {
                    type: "Feature",
                    properties: {
                        distance: route.summary.distance * factor,
                        duration: route.summary.duration,
                    },

                    geometry:
                        geom === null
                            ? null
                            : {
                                  type: "LineString",
                                  coordinates: geom,
                              },
                }

                routes.push(new Direction(feat, route))
            })

            return new Directions(routes, response)
        }
    }

    isochrones(
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts?: ORSIsochroneOpts,
        dryRun?: false
    ): Promise<Isochrones<ORSIsochroneResponse>>
    isochrones(
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts: ORSIsochroneOpts,
        dryRun: true
    ): Promise<string>
    async isochrones(
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts: ORSIsochroneOpts = {},
        dryRun?: boolean
    ): Promise<Isochrones<ORSIsochroneResponse> | string> {
        const { interval_type, ...rest } = isochronesOpts
        const params: ORSIsochroneParams = {
            locations: [location],
            range: intervals,
            ...rest,
        }

        if (interval_type) {
            params.range_type = interval_type
        }

        return this.client
            .request({
                endpoint: `/v2/isochrones/${profile}`,
                postParams: params,
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return ORS.parseIsochroneResponse(
                        res as ORSIsochroneResponse,
                        interval_type
                    ) as Isochrones<ORSIsochroneResponse>
                } else {
                    return res
                }
            })
    }

    public static parseIsochroneResponse(
        response: ORSIsochroneResponse,
        intervalType?: "time" | "distance"
    ): Isochrones<ORSIsochroneResponse> {
        const isochrones: Isochrone[] = []

        response.features.forEach((feature, index) => {
            isochrones.push(
                new Isochrone(
                    feature.properties.center,
                    feature.properties.interval,
                    intervalType ? intervalType : "time",
                    feature
                )
            )
        })

        return new Isochrones(isochrones, response)
    }

    matrix(
        locations: [number, number][],
        profile: ORSProfile,
        matrixOpts?: ORSMatrixOpts,
        dryRun?: false
    ): Promise<Matrix<ORSMatrixResponse>>
    matrix(
        locations: [number, number][],
        profile: ORSProfile,
        matrixOpts: ORSMatrixOpts,
        dryRun: true
    ): Promise<string>
    async matrix(
        locations: [number, number][],
        profile: ORSProfile,
        matrixOpts: ORSMatrixOpts = {},
        dryRun?: boolean
    ): Promise<Matrix<ORSMatrixResponse> | string> {
        const params: ORSMatrixParams = {
            locations,
            ...matrixOpts,
        }

        return this.client
            .request({
                endpoint: `/v2/matrix/${profile}/json`,
                postParams: params,
                dryRun,
            })
            .then((res) => {
                if (typeof res === "object") {
                    return ORS.parseMatrixResponse(
                        res as ORSMatrixResponse
                    ) as Matrix<ORSMatrixResponse>
                } else {
                    return res
                }
            })
    }

    public static parseMatrixResponse(
        response: ORSMatrixResponse
    ): Matrix<ORSMatrixResponse> {
        return new Matrix(response.durations, response.distances, response)
    }
}

export default ORS
