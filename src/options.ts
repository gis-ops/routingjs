import { AxiosProxyConfig } from "axios"

interface optionsInterface {
    defaultTimeout: number
    defaultRetryTimeout: number
    defaultUserAgent: string
    defaultProxy?: false | AxiosProxyConfig
}

const options: optionsInterface = {
    defaultTimeout: 30000,
    defaultRetryTimeout: 30000,
    defaultProxy: false,
    defaultUserAgent: "routing-js-",
}

export default options
