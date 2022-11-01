import { ORSMatrixResponse } from "ors/parameters"
import { OSRMTableResponse } from "osrm/parameters"
import { ValhallaMatrixResponse } from "valhalla/parameters"

class Matrix<T = undefined> {
    T: ValhallaMatrixResponse | OSRMTableResponse | ORSMatrixResponse
    constructor(
        public readonly durations: (number | null | undefined)[][],
        public readonly distances: (number | null | undefined)[][],
        public readonly raw: T
    ) {}
}

export default Matrix
