import { Feature, LineString } from "geojson"
import { OSRMRoute, OSRMRouteResponse } from "./parameters/osrm"
import { ValhallaRouteResponse } from "./parameters/valhalla"

export class Directions {
    constructor(
        public readonly directions?: Direction[],
        public readonly raw?: ValhallaRouteResponse | OSRMRouteResponse
    ) {}
}

interface DirectionProps {
    duration: number | null
    distance: number | null
}

export type DirectionFeat = Feature<LineString, DirectionProps>

export class Direction {
    constructor(
        public readonly feature?: DirectionFeat,
        public readonly raw?: ValhallaRouteResponse | OSRMRoute
    ) {}
}
