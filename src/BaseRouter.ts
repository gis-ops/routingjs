import { AxiosRequestConfig } from "axios"
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
    client: Client

    directions: (
        locations: number[][],
        profile: string,
        directionsOpts?: { [k: string]: any },
        dryRun?: boolean
    ) => Promise<Directions<Record<string, any>> | string>

    matrix: (
        locations: [number, number][],
        profile: string,
        matrixOpts?: { [k: string]: any },
        dryRun?: boolean
    ) => Promise<Matrix<Record<string, any>> | string>

    isochrones?: (
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts?: { [k: string]: any },
        dryRun?: boolean
    ) => Promise<Isochrones<Record<string, any>> | string>
}
