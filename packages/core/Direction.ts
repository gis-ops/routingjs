import { Feature, LineString } from "geojson"

export class Directions<T, U> {
    constructor(
        public readonly directions: Direction<U>[],
        public readonly raw: T
    ) {}
}

interface DirectionProps {
    duration: number | null
    distance: number | null
}

export type DirectionFeat = Feature<LineString | null, DirectionProps>

export class Direction<T> {
    constructor(
        public readonly feature: DirectionFeat,
        public readonly raw?: T
    ) {}
}
