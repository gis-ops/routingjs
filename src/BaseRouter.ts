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
    ) => Promise<Directions<Record<string, any>> | string>

    matrix: (
        locations: [number, number][],
        profile: string,
        matrixOpts?: { [k: string]: any },
        dryRun?: boolean
    ) => Promise<Matrix<Record<string, any>> | string>

    isochrones?: (
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts?: { [k: string]: any },
        dryRun?: boolean
    ) => Promise<Isochrones<Record<string, any>> | string>
}
