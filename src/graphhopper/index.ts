import { decode } from "@googlemaps/polyline-codec"
import { AxiosRequestConfig } from "axios"
import { BaseRouter } from "BaseRouter"
import Client from "Client"
import { Direction, Directions } from "Direction"
import { RoutingJSError } from "error"
import { LineString } from "geojson"
import {
    GraphHopperProfile,
    GraphHopperRouteParams,
    GraphHopperRouteResponse,
} from "graphhopper/parameters"
import options from "options"

type GraphHopperDirectionsOpts = Omit<
    GraphHopperRouteParams,
    "points" | "profile"
>

class GraphHopper implements BaseRouter {
    client: Client

    constructor(
        public readonly apiKey?: string,
        public readonly baseUrl: string = "https://graphhopper.com/api/1",
        public readonly userAgent?: string,
        public readonly headers?: { [k: string]: string },
        public readonly timeout: number = options.defaultTimeout,
        public readonly retryOverQueryLimit: boolean = false,
        public readonly maxRetries: number = options.defaultMaxRetries,
        public readonly skipApiError: boolean = false,
        protected readonly axiosOpts?: AxiosRequestConfig
    ) {
        if (baseUrl === "https://api.openrouteservice.org" && !apiKey) {
            throw new RoutingJSError("Please provide an API key for ORS")
        }

        this.client = new Client(
            baseUrl,
            userAgent,
            timeout,
            retryOverQueryLimit,
            headers,
            maxRetries,
            skipApiError,
            axiosOpts
        )
    }
    directions(
        locations: [number, number][],
        profile: GraphHopperProfile,
        directionsOpts?: GraphHopperDirectionsOpts,
        dryRun?: false
    ): Promise<Directions<GraphHopperRouteResponse>>
    directions(
        locations: [number, number][],
        profile: GraphHopperProfile,
        directionsOpts: GraphHopperDirectionsOpts,
        dryRun: true
    ): Promise<string>
    public async directions(
        locations: [number, number][],
        profile: GraphHopperProfile,
        directionsOpts?: GraphHopperDirectionsOpts,
        dryRun?: boolean | undefined
    ): Promise<string | Directions<GraphHopperRouteResponse>> {
        const params: GraphHopperRouteParams = {
            profile,
            points: locations.map(([lat, lon]) => [lon, lat]), // reverse order for POST requests
            ...directionsOpts,
        }

        return this.client
            .request(
                `/route${this.apiKey ? "?key=" + this.apiKey : ""}`,
                undefined,
                params,
                undefined,
                dryRun
            )
            .then((res) => {
                if (typeof res === "object") {
                    return GraphHopper.parseDirectionsResponse(
                        res as GraphHopperRouteResponse
                    ) as Directions<GraphHopperRouteResponse>
                } else {
                    return res
                }
            })
    }

    public static parseDirectionsResponse(
        response: GraphHopperRouteResponse
    ): Directions<GraphHopperRouteResponse> {
        return new Directions(
            response.paths.map((path) => {
                let geometry = path.points

                if (path.points_encoded) {
                    geometry = {
                        type: "LineString",
                        coordinates: decode(path.points as string, 5) as [
                            number,
                            number
                        ][],
                    }
                }

                return new Direction(
                    {
                        type: "Feature",
                        geometry: geometry as LineString,
                        properties: {
                            duration: path.time,
                            distance: path.distance,
                        },
                    },
                    path
                )
            }),
            response
        )
    }
}
