import axios, {
    Axios,
    AxiosProxyConfig,
    AxiosRequestConfig,
    AxiosInstance,
    AxiosResponse,
} from "axios"
import axiosRetry, {
    IAxiosRetryConfig,
    isNetworkOrIdempotentRequestError,
} from "axios-retry"

import options from "./options"

interface ClientInterface {
    readonly baseURL: string
    readonly userAgent: string
    readonly timeout: number
    readonly retryOverQueryLimit: boolean
    readonly proxy?: false | AxiosProxyConfig
    readonly maxRetries?: number
}

/**
 * Arguments passed to the client's request method.
 */
interface requestArgs<
    GetParams extends Record<string | number, any> | undefined = undefined,
    PostParams extends Record<string | number, any> | undefined = undefined
> {
    /**
     * @param endpoint - the endpoint the request is directed to. Is concatenated to the base URL
     */
    endpoint: string
    /**
     * @param getParams - parameters passed with a GET request
     */
    getParams?: GetParams
    /**
     * @param postParams - parameters passed with a POST request */
    postParams?: PostParams
    /**
     * @param dryRun - if true, the actual request is not made, and instead returns a string
     * containing information about the request to be made (including URL andparameters)
     */
    dryRun?: boolean
}

/**
 * The client class from which all underlying requests to the routing eninges' servers are made.
 *
 * @public
 *
 */
class Client<
    ResponseType,
    GetParams extends Record<string | number, any> | undefined = undefined,
    PostParams extends Record<string | number, any> | undefined = undefined
> implements ClientInterface
{
    protected axiosInstance: Axios
    protected axiosOptions: AxiosRequestConfig
    public readonly proxy?: false | AxiosProxyConfig

    /**
     * Create a new client instance
     * @param baseURL - the base URL that requests will be made to
     * @param userAgent - define a custom user agent to be passed in each request header
     * @param timeout - the time to await a response
     * @param retryOverQueryLimit - whether or not requests should be retried when
     *        receiving a status 429 response
     * @param headers - additional headers to be passed with each request
     * @param maxRetries - the maximum number of retries made by axios-retry
     * @param additionalAxiosOpts - any additional options that are passed to the axios instance
     *
     */
    constructor(
        public baseURL: string,
        public userAgent: string = options.defaultUserAgent,
        public readonly timeout = options.defaultTimeout,
        public retryOverQueryLimit: boolean = false,
        public readonly headers?: { [k: string]: string | number },
        public maxRetries: number = options.defaultMaxRetries,
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

    /**
     * The main request method. Decides whether a GET or POST request is to be made depending on
     * the passed arguments.
     *
     * @param requestArgs - the parameters passed as an object
     */
    async request(
        requestArgs: requestArgs<GetParams, PostParams>
    ): Promise<ResponseType | string> {
        const { endpoint, getParams, postParams, dryRun } = requestArgs
        const urlObj = new URL(`${this.baseURL}${endpoint}`)
        if (postParams !== undefined) {
            if (getParams !== undefined) {
                for (const [k, v] of Object.entries(getParams)) {
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

        } else {
            if (dryRun === true) {
                const requestInfo = `
                URL: ${urlObj.toString()}
                Method: GET
                Parameters: ${JSON.stringify(getParams)}
            `
                return new Promise((resolve) => resolve(requestInfo))
            }

            return this.axiosInstance
                .get(urlObj.toString(), {
                    params: getParams,
                })
                .then((res: AxiosResponse) => res.data)
        }
    }
}

export default Client
