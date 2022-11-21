import axios, {
    Axios,
    AxiosProxyConfig,
    AxiosRequestConfig,
    AxiosInstance,
    AxiosError,
} from "axios"
import axiosRetry, {
    IAxiosRetryConfig,
    isNetworkOrIdempotentRequestError,
} from "axios-retry"
import { RoutingJSAPIError } from "error"
import { FeatureCollection } from "geojson"
import {
    ORSIsochroneParams,
    ORSMatrixParams,
    ORSRouteParams,
} from "./ors/parameters"
import options from "./options"
import {
    OSRMRouteParams,
    OSRMRouteResponse,
    OSRMTableParams,
    OSRMTableResponse,
} from "./osrm/parameters"
import {
    MapboxAuthParams,
    ValhallaIsochroneParams,
    ValhallaMatrixParams,
    ValhallaMatrixResponse,
    ValhallaRouteParams,
    ValhallaRouteResponse,
} from "./valhalla/parameters"
import {
    GraphHopperIsochroneGetParams,
    GraphHopperMatrixParams,
    GraphHopperRouteParams,
} from "graphhopper/parameters"

interface ClientInterface {
    readonly baseURL: string
    readonly userAgent: string
    readonly timeout: number
    readonly retryOverQueryLimit: boolean
    readonly proxy?: false | AxiosProxyConfig
    readonly maxRetries?: number
}

class Client implements ClientInterface {
    protected axiosInstance: Axios
    protected axiosOptions: AxiosRequestConfig
    public readonly proxy?: false | AxiosProxyConfig
    //public readonly headers?: { [k: string]: string | number }

    constructor(
        public baseURL: string,
        public userAgent: string = options.defaultUserAgent,
        public readonly timeout = options.defaultTimeout,
        public retryOverQueryLimit: boolean,
        public readonly headers?: { [k: string]: string | number },
        public maxRetries: number = options.defaultMaxRetries,
        public readonly skipAPIError: boolean = false,
        public additionalAxiosOpts?: AxiosRequestConfig
    ) {
        this.headers = {
            ...options.defaultHeaders,
            "User-Agent": userAgent,
            ...this.headers,
        }
        this.axiosOptions = {
            headers: this.headers,
            timeout,
            ...additionalAxiosOpts,
        }

        this.axiosInstance = axios.create(this.axiosOptions)
        this.proxy = additionalAxiosOpts?.proxy
        this.axiosInstance.interceptors.request.use((request) => {
            console.log("Starting Request", JSON.stringify(request, null, 2))
            return request
        })

        const retryOpts: IAxiosRetryConfig = {
            retries: maxRetries,
            retryCondition: retryOverQueryLimit
                ? (error) =>
                      isNetworkOrIdempotentRequestError(error) ||
                      error.response?.status == 429
                : undefined,
            retryDelay: axiosRetry.exponentialDelay,
            onRetry: (number, error) =>
                console.log(
                    `Request failed with status code ${error.response?.status}: ${error.response?.statusText}. Retry number ${number}.`
                ),
        }

        axiosRetry(this.axiosInstance as AxiosInstance, retryOpts)
    }

    async request(
        url: string,
        getParams?:
            | Partial<OSRMRouteParams>
            | Partial<OSRMTableParams>
            | (
                  | {
                        [k in keyof GraphHopperIsochroneGetParams]: GraphHopperIsochroneGetParams[k]
                    }
                  | { key: string }
              ),
        postParams?:
            | ValhallaIsochroneParams
            | ValhallaRouteParams
            | ValhallaMatrixParams
            | ORSRouteParams
            | ORSMatrixParams
            | ORSIsochroneParams
            | GraphHopperRouteParams
            | GraphHopperMatrixParams,
        auth?: MapboxAuthParams,
        dryRun?: boolean
    ): Promise<
        | ValhallaRouteResponse
        | ValhallaMatrixResponse
        | FeatureCollection
        | OSRMRouteResponse
        | OSRMTableResponse
        | string
    > {
        const urlObj = new URL(`${this.baseURL}${url}`)
        if (postParams !== undefined) {
            if (auth !== undefined) {
                for (const [k, v] of Object.entries(auth)) {
                    urlObj.searchParams.append(k, v)
                }
            }
            if (dryRun === true) {
                const requestInfo = `
                URL: ${urlObj.toString()}
                Method: POST
                Parameters: ${JSON.stringify(postParams)}
            `
                return new Promise((resolve) => {
                    resolve(requestInfo)
                })
            }
            return this.axiosInstance
                .post(urlObj.toString(), postParams)
                .then((res) => res.data)
                .catch((error) => {
                    throw new RoutingJSAPIError(
                        `Request failed with status ${
                            (error as AxiosError).response?.status
                        }: ${JSON.stringify(error as AxiosError)}`
                    )
                })
        } else {
            if (dryRun === true) {
                const requestInfo = `
                URL: ${urlObj.toString()}
                Method: GET
                Parameters: ${JSON.stringify(getParams)}
            `
                return new Promise((resolve) => resolve(requestInfo))
            }
            console.log(urlObj.toString())
            console.log(getParams)

            return this.axiosInstance
                .get(urlObj.toString(), {
                    params: getParams,
                })
                .catch((error) => {
                    throw new RoutingJSAPIError(
                        `Request failed with error message ${
                            (error as AxiosError).status
                        }: ${(error as AxiosError).message}`
                    )
                })
                .then((res) => res.data)
        }
    }
}

export default Client
