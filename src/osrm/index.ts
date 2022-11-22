import { decode } from "@googlemaps/polyline-codec"
import { AxiosRequestConfig } from "axios"
import Client from "../Client"
import { Direction, DirectionFeat, Directions } from "../Direction"
import { RoutingJSAPIError, RoutingJSError } from "error"
import Matrix from "../Matrix"
import options from "options"
import {
    OSRMGeometryObject,
    OSRMGeometryType,
    OSRMOverviewType,
    OSRMRouteParams,
    OSRMRouteResponse,
    OSRMTableParams,
    OSRMTableResponse,
} from "./parameters"
import { BaseRouter } from "../BaseRouter"

interface OSRMBaseOpts {
    radiuses?: (number | null)[]
    bearings?: ([number, number | null] | null)[]
}

interface OSRMDirectionsOpts extends OSRMBaseOpts {
    alternatives?: false | number
    steps?: boolean
    continueStraight?: boolean | "default"
    annotations?: boolean
    geometries?: OSRMGeometryType
    overview?: OSRMOverviewType
}

interface OSRMMatrixOpts extends OSRMDirectionsOpts {
    sources?: number[]
    destinations?: number[]
}

class OSRM implements BaseRouter {
    client: Client
    constructor(
        public readonly baseUrl: string = "https://routing.openstreetmap.de/routed-bike",
        public readonly apiKey?: string,
        public readonly userAgent?: string,
        public readonly headers?: { [k: string]: string },
        public readonly timeout: number = options.defaultTimeout,
        public readonly retryOverQueryLimit: boolean = false,
        public readonly maxRetries: number = options.defaultMaxRetries,
        protected readonly axiosOpts?: AxiosRequestConfig
    ) {
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

    public async directions(
        locations: [number, number][],
        profile: string,
        directionsOpts?: OSRMDirectionsOpts,
        dryRun?: false
    ): Promise<Directions<OSRMRouteResponse>>
    public async directions(
        locations: [number, number][],
        profile: string,
        directionsOpts: OSRMDirectionsOpts,
        dryRun: true
    ): Promise<string>
    public async directions(
        locations: [number, number][],
        profile = "driving",
        directionsOpts: OSRMDirectionsOpts = {},
        dryRun = false
    ): Promise<Directions<OSRMRouteResponse> | string> {
        const coords = locations
            .map((tuple) => `${tuple[0]},${tuple[1]}`)
            .join(";")

        const params = OSRM.getDirectionParams(directionsOpts)

        return this.client
            .request({
                endpoint: `/route/v1/${profile}/${coords}`,
                getParams: params,
                dryRun,
            })
            .then((res) => {
                return OSRM.parseDirectionsResponse(
                    res as OSRMRouteResponse
                ) as Directions<OSRMRouteResponse>
            })
            .catch((error) => {
                throw new RoutingJSError(error.message)
            })
    }

    protected static getDirectionParams(
        directionsOpts: OSRMDirectionsOpts = {}
    ): Partial<OSRMRouteParams> {
        const params: Partial<OSRMRouteParams> = {}

        if (directionsOpts.radiuses) {
            params.radiuses = directionsOpts.radiuses.join(";")
        }

        if (directionsOpts.bearings) {
            params.bearings = directionsOpts.bearings
                .map((bearing) => {
                    if (bearing === null) {
                        return ""
                    } else {
                        return `${bearing[0]},${
                            bearing[1] === null ? "" : bearing[1]
                        }`
                    }
                })
                .join(";")
        }

        if (directionsOpts.alternatives !== undefined) {
            params.alternatives = directionsOpts.alternatives.toString()
        }

        if (directionsOpts.steps !== undefined) {
            params.steps = directionsOpts.steps.toString()
        }

        if (directionsOpts.continueStraight !== undefined) {
            params.continue_straight =
                directionsOpts.continueStraight.toString()
        }

        if (directionsOpts.annotations !== undefined) {
            params.annotations = directionsOpts.annotations.toString()
        }

        if (directionsOpts.geometries) {
            params.geometries = directionsOpts.geometries
        }

        if (directionsOpts.overview) {
            params.overview = directionsOpts.overview
        }

        return params
    }

    public static parseDirectionsResponse(
        response: OSRMRouteResponse,
        geometryFormat?: OSRMGeometryType
    ): Directions<OSRMRouteResponse> {
        const directions = response.routes.map((route) => {
            const feature: DirectionFeat = {
                type: "Feature",
                geometry: OSRM.parseGeometry(route.geometry, geometryFormat),
                properties: {
                    duration: route.duration
                        ? Math.round(route.duration)
                        : null,
                    distance: route.distance
                        ? Math.round(route.distance)
                        : null,
                },
            }
            return new Direction(feature, route)
        })

        return new Directions(directions, response)
    }

    protected static parseGeometry(
        routeGeometry: string | OSRMGeometryObject,
        geometryFormat?: OSRMGeometryType
    ): OSRMGeometryObject {
        if (geometryFormat !== "geojson") {
            const path = decode(
                routeGeometry as string,
                geometryFormat === undefined || geometryFormat === "polyline"
                    ? 5
                    : 6
            ) as [number, number][]

            return {
                coordinates: path,
                type: "LineString",
            }
        } else {
            return routeGeometry as OSRMGeometryObject
        }
    }

    public async matrix(
        locations: [number, number][],
        profile: string,
        matrixOpts?: OSRMMatrixOpts,
        dryRun?: false
    ): Promise<Matrix<OSRMTableResponse>>
    public async matrix(
        locations: [number, number][],
        profile: string,
        matrixOpts: OSRMMatrixOpts,
        dryRun: true
    ): Promise<string>
    public async matrix(
        locations: [number, number][],
        profile: string,
        matrixOpts: OSRMMatrixOpts = {},
        dryRun?: boolean
    ): Promise<Matrix<OSRMTableResponse> | string> {
        const coords = locations
            .map((tuple) => `${tuple[0]},${tuple[1]}`)
            .join(";")

        const params = OSRM.getMatrixParams(matrixOpts)

        return this.client
            .request({
                endpoint: `/table/v1/${profile}/${coords}`,
                getParams: params,
                dryRun,
            })
            .then((res) => {
                return OSRM.parseMatrixResponse(
                    res as OSRMTableResponse
                ) as Matrix<OSRMTableResponse>
            })
            .catch((error) => {
                throw new RoutingJSAPIError(error.message)
            })
    }

    protected static getMatrixParams(
        matrixOpts: OSRMMatrixOpts
    ): Partial<OSRMTableParams> {
        const params: Partial<OSRMTableParams> = {}
        if (matrixOpts.radiuses) {
            params.radiuses = matrixOpts.radiuses.join(";")
        }

        if (matrixOpts.bearings) {
            params.bearings = matrixOpts.bearings
                .map((bearing) => {
                    if (bearing === null) {
                        return ""
                    } else {
                        return `${bearing[0]},${
                            bearing[1] === null ? "" : bearing[1]
                        }`
                    }
                })
                .join(";")
        }

        if (matrixOpts.sources) {
            params.sources = matrixOpts.sources.join(";")
        }

        if (matrixOpts.destinations) {
            params.destinations = matrixOpts.destinations.join(";")
        }

        return params
    }

    public static parseMatrixResponse(
        response: OSRMTableResponse
    ): Matrix<OSRMTableResponse> {
        return new Matrix(response.durations, response.distances, response)
    }
}

export default OSRM
