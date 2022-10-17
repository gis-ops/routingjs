import { Geometry } from "./geojson"
import { OSRMRouteResponse } from "./parameters/osrm"
import { ValhallaRouteResponse } from "./parameters/valhalla"

class Directions {
    constructor(
        public readonly geometry: Geometry,
        public readonly duration: number,
        public readonly distance: number,
        public readonly raw: ValhallaRouteResponse | OSRMRouteResponse
    ) {}
}

export default Directions
