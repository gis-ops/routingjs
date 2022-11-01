import { Feature, Geometry } from "geojson"
import { ORSIsochroneResponse } from "ors/parameters"
import { ValhallaIsochroneResponse } from "valhalla/parameters"

export class Isochrones<T = undefined> {
    T: ORSIsochroneResponse | ValhallaIsochroneResponse
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
