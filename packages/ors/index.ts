import {
    BaseRouter,
    ClientConstructorArgs,
    Client,
    Direction,
    Directions,
    RoutingJSAPIError,
    ErrorProps,
    DirectionFeat,
    Matrix,
    Isochrone,
    Isochrones,
} from "@routingjs/core"

import {
    ORSFormat,
    ORSIsochroneParams,
    ORSIsochroneResponse,
    ORSMatrixParams,
    ORSMatrixResponse,
    ORSProfile,
    ORSRoute,
    ORSRouteParams,
    ORSRouteResponse,
    ORSUnit,
} from "./parameters"
import { decode } from "@googlemaps/polyline-codec"
import { AxiosError } from "axios"

type ORSErrorResponseProps = {
    error: {
        code: number
        message: string
    }
    info?:{
        engine: {version: string, build_date: string}
        timestamp: number
    }
}

/**
 * `ORSErrorProps` returns additional information about the error thrown by the 
 *  ORS routing engine. It sends a JSON response with two props: error and info where the error
 *  prop contains the error code and message. The info prop contains the engine version and 
 *  build date.
 */
export interface ORSErrorProps extends ErrorProps {
    errorCode?: number
}

export type ORSAPIError = RoutingJSAPIError<ORSErrorProps>

const handleORSError = (error: AxiosError<ORSErrorResponseProps>) => {
    const props: ORSErrorProps = {
        statusCode: error.response?.status,
        status: error.response?.statusText,
        errorCode: error.response?.data.error.code,
        errorMessage: error.response?.data.error.message
    }
    throw new RoutingJSAPIError<ORSErrorProps>(error.message, props)
}

// we pass the coordinates as the `locations` top level parameter
export type ORSDirectionsOpts = Omit<ORSRouteParams, "coordinates">

export type ORSMatrixOpts = Pick<
    ORSMatrixParams,
    "metrics" | "resolve_locations"
>

export type ORSIsochroneOpts = Omit<
    ORSIsochroneParams,
    "locations" | "range" | "interval"
>

export class ORS implements BaseRouter {
    client: Client<
        ORSRouteResponse | ORSIsochroneResponse | ORSMatrixResponse,
        undefined, // we don't make any GET requests to ORS
        ORSRouteParams | ORSMatrixParams | ORSIsochroneParams
    >
    apiKey?: string
    constructor(clientArgs?: ClientConstructorArgs) {
        const {
            apiKey,
            baseUrl,
            userAgent,
            timeout,
            retryOverQueryLimit,
            maxRetries,
            axiosOpts,
        } = clientArgs || {}

        let { headers } = clientArgs || {}

        if (apiKey) {
            headers = { ...headers, Authorization: apiKey }
        }

        const defaultURL = "https://api.openrouteservice.org"

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
    directions(
        locations: [number, number][],
        profile: ORSProfile,
        directionsOpts?: ORSDirectionsOpts,
        dryRun?: false,
        format?: ORSFormat
    ): Promise<Directions<ORSRouteResponse, ORSRoute>>
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
    ): Promise<Directions<ORSRouteResponse, ORSRoute> | string> {
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
                throw new Error(
                    "ORS: options.vehicle_type must be specified for driving-hgv if restrictions are set."
                )
            }
        }

        const params: ORSRouteParams = {
            coordinates: locations.map(([lat, lon]) => [lon, lat]),
            ...directionsOpts,
        }

        return this.client
            .request({
                endpoint: `/v2/directions/${profile}/${format}`,
                postParams: params,
                dryRun,
            })
            .then((res: ORSRouteResponse) => {
                if (typeof res === "object") {
                    return ORS.parseDirectionsResponse(
                        res,
                        format,
                        directionsOpts.units || "m"
                    )
                } else {
                    return res
                }
            })
            .catch(handleORSError)
    }

    public static parseDirectionsResponse(
        response: ORSRouteResponse,
        format: ORSFormat,
        units?: ORSUnit
    ): Directions<ORSRouteResponse, ORSRoute> {
        let factor = 1

        if (units === "km") {
            factor = 1000
        }

        if (units === "mi") {
            factor = 0.621371 * 1000
        }

        if (format === "geojson") {
            const routes: Direction<ORSRoute>[] = []
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
            const routes: Direction<ORSRoute>[] = []
            response.routes?.forEach((route) => {
                let geom = null
                if (route.geometry) {
                    geom = decode(route.geometry, 5).map(([lat, lon]) => [
                        lon,
                        lat,
                    ])
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

    reachability(
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts?: ORSIsochroneOpts,
        dryRun?: false
    ): Promise<Isochrones<ORSIsochroneResponse, any>>
    reachability(
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts: ORSIsochroneOpts,
        dryRun: true
    ): Promise<string>
    async reachability(
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts: ORSIsochroneOpts = {},
        dryRun?: boolean
    ): Promise<Isochrones<ORSIsochroneResponse, any> | string> {
        const { range_type, ...rest } = isochronesOpts
        const params: ORSIsochroneParams = {
            locations: [[location[1], location[0]]], // format must be lon/lat
            range: intervals,
            ...rest,
        }

        if (range_type) {
            params.range_type = range_type
        }

        return this.client
            .request({
                endpoint: `/v2/isochrones/${profile}`,
                postParams: params,
                dryRun,
            })
            .then((res: ORSIsochroneResponse) => {
                if (typeof res === "object") {
                    return ORS.parseIsochroneResponse(res, range_type)
                } else {
                    return res
                }
            })
            .catch(handleORSError)
    }

    public static parseIsochroneResponse(
        response: ORSIsochroneResponse,
        intervalType?: "time" | "distance"
    ): Isochrones<ORSIsochroneResponse, any> {
        const isochrones: Isochrone<any>[] = []

        response.features.forEach((feature) => {
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
            locations: locations.map(([lat, lon]) => [lon, lat]),
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
            .catch(handleORSError)
    }

    public static parseMatrixResponse(
        response: ORSMatrixResponse
    ): Matrix<ORSMatrixResponse> {
        return new Matrix(response.durations, response.distances, response)
    }
}

// make all exported types and interfaces available to the public API
export * from "./parameters"
