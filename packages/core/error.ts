export interface ErrorProps {
    statusCode?: number
    status?: string
    errorCode?: number
    errorMessage?: string
}

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