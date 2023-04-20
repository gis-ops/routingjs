/**
 * `ErrorProps` is the type of the `properties` field of the `RoutingJSAPIError` class.
 *  It is used to provide additional information about the error.
 */
export interface ErrorProps {
    /** `statusCode` describes the nature of the response */
    statusCode?: number
    /** `status` gives detailed info about that response */
    status?: string
    /** `errorMessage` explains the error specific to that RoutingAPI*/
    errorMessage?: string
}

/**
 * `RoutingJSAPIError` is the error class used to handle errors thrown by different Routing
 *  APIs.
 */
export class RoutingJSAPIError<T extends ErrorProps> extends Error {
    readonly properties: T

    constructor(message: string, properties: T) {
        super(message)
        this.properties = properties
    }

    toJSON() {
        return {
            message: this.message,
            properties: this.properties,
        }
    }
}
