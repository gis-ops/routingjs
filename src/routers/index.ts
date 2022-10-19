import Client from "client"
import { Directions } from "direction"
import { Isochrones } from "isochrone"
import Matrix from "matrix"

export interface BaseRouter {
    client: Client

    directions: (
        locations: number[][],
        profile: string,
        directionsOpts: { [k: string]: any },
        dryRun: boolean
    ) => Promise<Directions | undefined>

    matrix: (
        locations: [number, number][],
        profile: string,
        matrixOpts: { [k: string]: any },
        dryRun: boolean
    ) => Promise<Matrix | undefined>

    isochrones?: (
        location: [number, number],
        profile: string,
        intervals: number[],
        isochronesOpts: { [k: string]: any },
        dryRun: boolean
    ) => Promise<Isochrones>
}
