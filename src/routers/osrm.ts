import { AxiosRequestConfig } from "axios"
import Client from "client"
import { Directions } from "direction"
import options from "options"
import {
    OSRMGeometryType,
    OSRMOverviewType,
    OSRMRouteParams,
    OSRMRouteResponse,
} from "parameters/osrm"
import { Direction } from "readline"
import { BaseRouter } from "routers"

interface OSRMDirectionsOpts {
    radiuses?: (number | null)[]
    bearings?: ([number, number | null] | null)[]
    alternatives?: false | number
    steps?: boolean
    continueStraight?: boolean | "default"
    annotations?: boolean
    geometries?: OSRMGeometryType
    overview?: OSRMOverviewType
}

class OSRM implements BaseRouter {
    client: Client
    constructor(
        public readonly baseUrl: string = "https://routing.openstreetmap.de/routed-bike",
        public readonly apiKey?: string,
        public readonly userAgent?: string,
        public readonly timeout: number = options.defaultTimeout,
        public readonly retryOverQueryLimit: boolean = false,
        public readonly maxRetries: number = options.defaultMaxRetries,
        public readonly skipApiError: boolean = false,
        protected readonly axiosOpts?: AxiosRequestConfig
    ) {
        this.client = new Client(
            baseUrl,
            userAgent,
            timeout,
            retryOverQueryLimit,
            maxRetries,
            skipApiError,
            axiosOpts
        )
    }

    public async directions(
        locations: [number, number][],
        profile: string = "driving",
        directionsOpts?: OSRMDirectionsOpts,
        dryRun: boolean = false
    ): Promise<Directions | undefined> {
        const coords = locations
            .map((tuple) => `${tuple[0]},${tuple[1]}`)
            .join(";")

        const params = OSRM.getDirectionParams(directionsOpts)

        return this.client
            .request(`/route/v1/${profile}/${coords}`, params)
            .then((res) => {
                console.log(res)
                return OSRM.parseDirectionsResponse(
                    res as OSRMRouteResponse
                ) as Directions
            })
            .catch((error) => {
                console.log(error)
                return new Directions()
            })
    }

    protected static getDirectionParams(
        directionsOpts: OSRMDirectionsOpts = {}
    ): Partial<OSRMRouteParams> {
        const params: Partial<OSRMRouteParams> = {}

        if (directionsOpts.radiuses) {
            params.radiuses = directionsOpts.radiuses.join(";")
        }

        if (directionsOpts.bearings) {
            params.bearings = directionsOpts.bearings
                .map((bearing) => {
                    if (bearing === null) {
                        return ""
                    } else {
                        return `${bearing[0]},${
                            bearing[1] === null ? "" : bearing[1]
                        }`
                    }
                })
                .join(";")
        }

        if (directionsOpts.alternatives !== undefined) {
            params.alternatives = directionsOpts.alternatives.toString()
        }

        if (directionsOpts.steps !== undefined) {
            params.steps = directionsOpts.steps.toString()
        }

        if (directionsOpts.continueStraight !== undefined) {
            params.continue_straight =
                directionsOpts.continueStraight.toString()
        }

        if (directionsOpts.annotations !== undefined) {
            params.annotations = directionsOpts.annotations.toString()
        }

        if (directionsOpts.geometries) {
            params.geometries = directionsOpts.geometries
        }

        if (directionsOpts.overview) {
            params.overview = directionsOpts.overview
        }

        return params
    }

    public static parseDirectionsResponse(): Directions | Direction {}
}
