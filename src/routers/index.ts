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
        locations: number[][],
        profile: string,
        matrixOpts: { [k: string]: any },
        dryRun: boolean
    ) => Promise<Matrix>

    isochrones?: (
        location: [number, number],
        profile: string,
        isochronesOpts: { [k: string]: any },
        dryRun: boolean
    ) => Promise<Isochrones>
}
