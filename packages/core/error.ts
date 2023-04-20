/**
 * `ErrorProps` is the type of the `properties` field of the `RoutingJSAPIError` class.
 *  It is used to provide additional information about the error.
 */
export interface ErrorProps {
    /** `statusCode` stands for the HTTP response status code */
    statusCode?: number
    /** `status` gives detailed info about that response */
    status?: string
    /** `errorMessage` explains the error specific to that routing engine*/
    errorMessage?: string
}

/**
 * `RoutingJSAPIError` is the error class used to handle errors thrown by different routing
 *  engines.
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
