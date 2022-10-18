import { Feature, FeatureCollection } from "geojson"

export class Isochrones {
    constructor(
        public readonly isochrones?: Isochrone[],
        public readonly raw?: FeatureCollection
    ) {}
}

export class Isochrone {
    constructor(
        public readonly duration?: number,
        public readonly distance?: number,
        public readonly raw?: Feature
    ) {}
}
