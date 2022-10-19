import { OSRMTableResponse } from "./parameters/osrm"
import { ValhallaMatrixResponse } from "./parameters/valhalla"

class Matrix {
    constructor(
        public readonly durations?: (number | null | undefined)[][],
        public readonly distances?: (number | null | undefined)[][],
        public readonly raw?: ValhallaMatrixResponse | OSRMTableResponse
    ) {}
}

export default Matrix
