import { Feature, LineString } from "geojson"
import { ORSRoute, ORSRouteResponse } from "parameters/openrouteservice"
import { OSRMRoute, OSRMRouteResponse } from "./parameters/osrm"
import { ValhallaRouteResponse } from "./valhalla"

export class Directions {
    constructor(
        public readonly directions: Direction[],
        public readonly raw:
            | ValhallaRouteResponse
            | OSRMRouteResponse
            | ORSRouteResponse
    ) {}
}

interface DirectionProps {
    duration: number | null
    distance: number | null
}

export type DirectionFeat = Feature<LineString | null, DirectionProps>

export class Direction {
    constructor(
        public readonly feature: DirectionFeat,
        public readonly raw?: ValhallaRouteResponse | OSRMRoute | ORSRoute
    ) {}
}
