import { Feature, Geometry } from "geojson"

export class Isochrones<T> {
    constructor(
        public readonly isochrones: Isochrone[],
        public readonly raw: T
    ) {}
}

export class Isochrone {
    constructor(
        public readonly center: [number, number],
        public readonly interval: number,
        public readonly intervalType: string,
        public readonly feature: Feature<Geometry, any>
    ) {}
}
