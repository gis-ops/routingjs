import { decode } from "@googlemaps/polyline-codec"
import {
    Direction,
    DirectionFeat,
    Directions,
    Client,
    RoutingJSAPIError,
    ErrorProps,
    Matrix,
    BaseRouter,
    ClientConstructorArgs,
    Waypoint,
} from "@routingjs/core"

import {
    OSRMGeometryObject,
    OSRMGeometryType,
    OSRMOverviewType,
    OSRMRoute,
    OSRMRouteParams,
    OSRMRouteResponse,
    OSRMTableParams,
    OSRMTableResponse,
} from "./parameters"
import { AxiosError } from "axios"

type OSRMErrorResponseProps = {
    code: number
    message: string
}

/**
 * `OSRMErrorProps` returns additional information about the error thrown by the
 *  OSRM routing engine. It sends a JSON response with the following fields: code and message,
 *  where the specific code defines the kind of error that occurred.
 */
export interface OSRMErrorProps extends ErrorProps {
    errorCode?: number
}

export type OSRMAPIError = RoutingJSAPIError<OSRMErrorProps>

const handleOSRMError = (error: AxiosError<OSRMErrorResponseProps>) => {
    const props: OSRMErrorProps = {
        statusCode: error.response?.status,
        status: error.response?.statusText,
        errorCode: error.response?.data.code,
        errorMessage: error.response?.data.message,
    }
    throw new RoutingJSAPIError<OSRMErrorProps>(error.message, props)
}

interface OSRMBaseOpts {
    /** Limits the search to given radius in meters. */
    radiuses?: (number | null)[]
    /**
     * Limits the search to segments with given bearing in degrees towards true north in
     * clockwise direction.
     */
    bearings?: ([number, number | null] | null)[]
}

export interface OSRMDirectionsOpts extends OSRMBaseOpts {
    /**
     * Search for alternative routes and return as well.
     *
     * @remarks
     * Please note that even if an alternative route is requested, a result cannot be guaranteed.
     */
    alternatives?: false | number
    /** Return route steps for each route leg */
    steps?: boolean
    /**
     * Forces the route to keep going straight at waypoints constraining uturns there even if
     * it would be faster. Default value depends on the profile.
     */
    continueStraight?: boolean | "default"
    /** Returns additional metadata for each coordinate along the route geometry. */
    annotations?: boolean
    /** Returned route geometry format (influences overview and per step) */
    geometries?: OSRMGeometryType
    /**
     * Add overview geometry either full, simplified according to highest zoom level it
     * could be display on, or not at all.
     */
    overview?: OSRMOverviewType
}

export interface OSRMMatrixOpts extends OSRMDirectionsOpts {
    /** Use location with given index as source. */
    sources?: number[]
    /** Use location with given index as destination. */
    destinations?: number[]
}

export type OSRMDirections = Directions<OSRMRouteResponse, OSRMRoute>

export type OSRMMatrix = Matrix<OSRMTableResponse>

export type OSRMClient = Client<
    OSRMRouteResponse | OSRMTableResponse,
    Partial<OSRMRouteParams> | Partial<OSRMTableParams>
>

export class OSRM implements BaseRouter<Waypoint> {
    client: OSRMClient
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

        const defaultURL = "https://routing.openstreetmap.de/routed-bike"

        this.client =
            new Client(
                baseUrl || defaultURL,
                userAgent,
                timeout,
                retryOverQueryLimit,
                headers,
                maxRetries,
                axiosOpts
            ) || {}
    }

    /**
     * Makes a request to OSRM's `/route` endpoint.
     *
     * @param locations - The coordinates tuple the route should be calculated from in order of visit. Format: [lat, lon]
     * @param profile - Specifies the mode of transport (superfluous for OSRM)
     * @param directionsOpts - Additional parameters
     * @param dryRun - if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging
     */
    public async directions(
        locations: ([number, number] | Waypoint)[],
        profile: string,
        directionsOpts?: OSRMDirectionsOpts,
        dryRun?: false
    ): Promise<OSRMDirections>
    public async directions(
        locations: ([number, number] | Waypoint)[],
        profile: string,
        directionsOpts: OSRMDirectionsOpts,
        dryRun: true
    ): Promise<string>
    public async directions(
        locations: ([number, number] | Waypoint)[],
        profile = "driving",
        directionsOpts: OSRMDirectionsOpts = {},
        dryRun = false
    ): Promise<OSRMDirections | string> {
        const coords = locations
            .map((l) =>
                Array.isArray(l) ? `${l[1]},${l[0]}` : `${l.lon},${l.lat}`
            )
            .join(";")

        const params = OSRM.getDirectionParams(directionsOpts)

        return this.client
            .request({
                endpoint: `/route/v1/${profile}/${coords}`,
                getParams: params,
                dryRun,
            })
            .then((res: OSRMRouteResponse) => {
                return OSRM.parseDirectionsResponse(res)
            })
            .catch(handleOSRMError)
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
    ): OSRMDirections {
        const directions = response.routes.map((route) => {
            const feature: DirectionFeat = {
                type: "Feature",
                geometry:
                    OSRM.parseGeometry(route.geometry, geometryFormat) || null,
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
        routeGeometry?: string | OSRMGeometryObject,
        geometryFormat?: OSRMGeometryType
    ): OSRMGeometryObject | undefined {
        if (routeGeometry !== undefined) {
            if (geometryFormat !== "geojson") {
                const path = decode(
                    routeGeometry as string,
                    geometryFormat === undefined ||
                        geometryFormat === "polyline"
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
        } else {
            return undefined
        }
    }

    public async matrix(
        locations: ([number, number] | Waypoint)[],
        profile: string,
        matrixOpts?: OSRMMatrixOpts,
        dryRun?: false
    ): Promise<OSRMMatrix>
    public async matrix(
        locations: ([number, number] | Waypoint)[],
        profile: string,
        matrixOpts: OSRMMatrixOpts,
        dryRun: true
    ): Promise<string>
    public async matrix(
        locations: ([number, number] | Waypoint)[],
        profile: string,
        matrixOpts: OSRMMatrixOpts = {},
        dryRun?: boolean
    ): Promise<OSRMMatrix | string> {
        const coords = locations
            .map((l) =>
                Array.isArray(l) ? `${l[1]},${l[0]}` : `${l.lon},${l.lat}`
            )
            .join(";")

        const params = OSRM.getMatrixParams(matrixOpts)

        return this.client
            .request({
                endpoint: `/table/v1/${profile}/${coords}`,
                getParams: params,
                dryRun,
            })
            .then((res: OSRMTableResponse) => {
                return OSRM.parseMatrixResponse(res)
            })
            .catch(handleOSRMError)
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

    public static parseMatrixResponse(response: OSRMTableResponse): OSRMMatrix {
        return new Matrix(response.durations, response.distances, response)
    }
}

export * from "./parameters"
