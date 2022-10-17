import { Axios, AxiosProxyConfig, AxiosRequestConfig } from "axios"
import options from "./options"

interface ClientInterface {
    readonly baseURL: string
    readonly userAgent?: string
    readonly timeout: number
    retryOverQueryLimit: boolean
    readonly proxy?: false | AxiosProxyConfig
}

class Client implements ClientInterface {
    protected axiosInstance: Axios
    public proxy?: false | AxiosProxyConfig | undefined

    constructor(
        public baseURL: string,
        public userAgent: string = options.defaultUserAgent,
        protected readonly headers: { [k: string]: string | number },
        public readonly timeout = options.defaultTimeout,
        public retryOverQueryLimit: boolean,
        protected additionalAxiosOpts?: AxiosRequestConfig
    ) {
        const axiosOptions: AxiosRequestConfig = {
            baseURL,
            headers: { ...headers, userAgent },
            timeout,
        }
        this.axiosInstance = new Axios({
            ...axiosOptions,
            ...additionalAxiosOpts,
        })
        this.proxy = additionalAxiosOpts?.proxy
    }

    request(url: string, getParams: ) {}
}
