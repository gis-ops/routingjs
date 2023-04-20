export interface ErrorProps {
    status_code: number | undefined
    status: string | undefined
}

export interface CommonErrorProps extends ErrorProps {
    error_code: number | undefined
    error: string | undefined
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

export const assertError = <T extends ErrorProps>(e: RoutingJSAPIError<T>) => {
    expect(e.properties).toBeDefined()
    expect(e.properties).toHaveProperty("status_code")
    expect(e.properties).toHaveProperty("status")
    expect(e.properties).toHaveProperty("error_code")
    expect(e.properties).toHaveProperty("error")
}