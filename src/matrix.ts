import { OSRMTableResponse } from "./parameters/osrm"
import { ValhallaMatrixResponse } from "./parameters/valhalla"

class Matrix {
    constructor(
        public readonly duration: number,
        public readonly distance: number,
        public readonly raw: ValhallaMatrixResponse | OSRMTableResponse
    ) {}
}

export default Matrix
