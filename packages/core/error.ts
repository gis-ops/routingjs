export class RoutingJSAPIError extends Error {
    readonly properties

    constructor(message: string, properties: any) {
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
