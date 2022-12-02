import { Feature, Geometry } from "geojson"

export class Isochrones<T, U> {
    constructor(
        public readonly isochrones: Isochrone<U>[],
        public readonly raw: T
    ) {}
}

export class Isochrone<T> {
    constructor(
        public readonly center: [number, number],
        public readonly interval: number,
        public readonly intervalType: string,
        public readonly feature: Feature<Geometry, T>
    ) {}
}
