import { Feature, LineString } from "geojson"
import { ORSRoute } from "./ors/parameters"
import { OSRMRoute } from "./osrm/parameters"
import { ValhallaRouteResponse } from "./valhalla/parameters"

export class Directions<T> {
    constructor(
        public readonly directions: Direction[],
        public readonly raw: T
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
