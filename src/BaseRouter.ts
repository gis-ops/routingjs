import Client from "./Client"
import { Directions } from "./Direction"
import { Isochrones } from "./Isochrone"
import Matrix from "./Matrix"

export interface BaseRouter {
    client: Client

    directions: (
        locations: number[][],
        profile: string,
        directionsOpts?: { [k: string]: any },
        dryRun?: boolean
    ) => Promise<Directions | string>

    matrix: (
        locations: [number, number][],
        profile: string,
        matrixOpts?: { [k: string]: any },
        dryRun?: boolean
    ) => Promise<Matrix | string>

    isochrones?: (
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts?: { [k: string]: any },
        dryRun?: boolean
    ) => Promise<Isochrones | string>
}
