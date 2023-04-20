import { ValhallaAPIError } from "valhalla"
import { OSRMAPIError } from "osrm"
import { ORSAPIError } from "ors"

export const assertError = (e: ValhallaAPIError | OSRMAPIError | ORSAPIError) => {
    expect(e.properties).toBeDefined()
    expect(e.properties).toHaveProperty("statusCode")
    expect(e.properties).toHaveProperty("status")
    expect(e.properties).toHaveProperty("errorCode")
    expect(e.properties).toHaveProperty("errorMessage")
}
