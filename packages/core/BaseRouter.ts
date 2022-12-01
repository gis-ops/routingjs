import { AxiosRequestConfig } from "axios"
import { JSONObject, JSONValue } from "core/json"
import Client from "./Client"
import { Directions } from "./Direction"
import { Isochrones } from "./Isochrone"
import Matrix from "./Matrix"

export interface ClientConstructorArgs {
    /**
     * Base URL that all requests are directed to. If not specified,
     * the router's default public API at is used (API key may be required)
     */
    readonly baseUrl?: string

    /**
     * Optional API key that is passed as part of the URL params
     */
    readonly apiKey?: string

    /**
     * overwrites the default user agent header.
     */
    readonly userAgent?: string

    /**
     * additional headers passed to be passed in the request
     */
    readonly headers?: { [k: string]: string }

    /**
     * Custom request timeout
     */
    readonly timeout?: number

    /**
     * Whether requests should be retried on status code 429 responses
     */
    readonly retryOverQueryLimit?: boolean

    /**
     * maximum number of retries performed by axios-retry
     */
    readonly maxRetries?: number

    /**
     * other options passed to the axios instance
     */
    readonly axiosOpts?: AxiosRequestConfig
}

export interface BaseRouter {
    client: Client<
        Record<string | number, any>,
        Record<string | number, any> | undefined,
        Record<string | number, any> | undefined
    >

    directions: (
        locations: number[][],
        profile: string,
        directionsOpts?: Record<string | number | symbol, JSONValue>,
        dryRun?: boolean
    ) => Promise<Directions<any, any> | string>

    matrix: (
        locations: [number, number][],
        profile: string,
        matrixOpts?: JSONObject,
        dryRun?: boolean
    ) => Promise<Matrix<any> | string>

    reachability?: (
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts?: JSONObject,
        dryRun?: boolean
    ) => Promise<Isochrones<any, any> | string>
}
