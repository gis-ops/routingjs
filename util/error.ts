import { RoutingJSAPIError, ErrorProps } from "@routingjs/core"

export const assertError = <T extends ErrorProps>(e: RoutingJSAPIError<T>) => {
    expect(e.properties).toBeDefined()
    expect(e.properties).toHaveProperty("statusCode")
    expect(e.properties).toHaveProperty("status")
    expect(e.properties).toHaveProperty("errorCode")
    expect(e.properties).toHaveProperty("errorMessage")
}
