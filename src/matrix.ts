import { OSRMTableResponse } from "./parameters/osrm"
import { ValhallaMatrixResponse } from "./valhalla"

class Matrix {
    constructor(
        public readonly durations: (number | null | undefined)[][],
        public readonly distances: (number | null | undefined)[][],
        public readonly raw: ValhallaMatrixResponse | OSRMTableResponse
    ) {}
}

export default Matrix
