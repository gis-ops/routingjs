import axios, {
    Axios,
    AxiosProxyConfig,
    AxiosRequestConfig,
    AxiosInstance,
} from "axios"
import axiosRetry, {
    IAxiosRetryConfig,
    isNetworkOrIdempotentRequestError,
} from "axios-retry"
import { FeatureCollection } from "geojson"
import options from "./options"
import {
    OSRMRouteParams,
    OSRMRouteResponse,
    OSRMTableParams,
    OSRMTableResponse,
} from "./parameters/osrm"
import {
    MapboxAuthParams,
    ValhallaIsochroneParams,
    ValhallaMatrixParams,
    ValhallaMatrixResponse,
    ValhallaRouteParams,
    ValhallaRouteResponse,
} from "./parameters/valhalla"

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
    public readonly headers: { [k: string]: string }

    constructor(
        public baseURL: string,
        public userAgent: string = options.defaultUserAgent,
        //public readonly headers: { [k: string]: string | number },
        public readonly timeout = options.defaultTimeout,
        public retryOverQueryLimit: boolean,
        public maxRetries: number = options.defaultMaxRetries,
        public readonly skipAPIError: boolean = false,
        public additionalAxiosOpts?: AxiosRequestConfig
    ) {
        this.headers = { "Content-Type": "application/json" }
        this.headers["User-Agent"] = userAgent
        this.axiosOptions = {
            headers: this.headers,
            timeout,
            ...additionalAxiosOpts,
        }

        this.axiosInstance = axios.create(this.axiosOptions)
        this.proxy = additionalAxiosOpts?.proxy

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
        getParams?: Partial<OSRMRouteParams> | Partial<OSRMTableParams>,
        postParams?:
            | ValhallaIsochroneParams
            | ValhallaRouteParams
            | ValhallaMatrixParams,
        auth?: MapboxAuthParams,
        dryRun: boolean = false
    ): Promise<
        | ValhallaRouteResponse
        | ValhallaMatrixResponse
        | FeatureCollection
        | OSRMRouteResponse
        | OSRMTableResponse
        | undefined
    > {
        const urlObj = new URL(url, this.baseURL)

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
                console.log(requestInfo)
                return new Promise((resolve) => {
                    resolve(undefined)
                })
            }
            return this.axiosInstance
                .post(urlObj.toString(), postParams)
                .then((res) => res.data)
                .catch((error) => {
                    console.log("Something happend in the client!")
                    throw error
                })
        } else {
            if (dryRun === true) {
                const requestInfo = `
                URL: ${this.baseURL}${urlObj.toString()}
                Method: GET
                Parameters: ${JSON.stringify(getParams)}
            `
                console.log(requestInfo)
                return new Promise((resolve) => resolve(undefined))
            }
            return this.axiosInstance
                .get(urlObj.toString(), {
                    params: getParams,
                })
                .then((res) => res.data)
                .catch((error) => {
                    console.log("Something happend in the client!")
                    throw error
                })
        }
    }
}

export default Client
