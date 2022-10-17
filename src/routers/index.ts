import Directions from "src/direction"
import Matrix from "src/matrix"

export interface BaseRouter {
    directions: (
        locations: number[][],
        profile: string,
        ...args: any
    ) => Directions

    matrix: (locations: number[][], profile: string, ...args: any) => Matrix

    isochrones?: (
        location: [number, number],
        profile: string,
        ...args: any
    ) => Isochrones
}
