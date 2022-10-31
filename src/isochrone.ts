import { Feature, FeatureCollection, LineString, Polygon } from "geojson"

export class Isochrones {
    constructor(
        public readonly isochrones: Isochrone[],
        public readonly raw: FeatureCollection
    ) {}
}

export class Isochrone {
    constructor(
        public readonly center: [number, number],
        public readonly interval: number,
        public readonly intervalType: string,
        public readonly feature: Feature<LineString | Polygon, any>
    ) {}
}
