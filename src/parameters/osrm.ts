import { Geometry } from "src/geojson"

interface OSRMBaseParams {
    coordinates: string
    profile: string
    bearings?: (number | null)[][]
    radiuses?: (number | null)[]
    hint?: string[]
}

export interface OSRMRouteParams extends OSRMBaseParams {
    alternatives?: boolean
    steps?: boolean
    annotations?: boolean
    geometries?: "polyline" | "polyline6" | "geojson"
    overview?: "simplified" | "full" | false
    continue_straight?: "default" | boolean
}

interface OSRMBaseResponse {
    code: OSRMResponseCode
}

export interface OSRMRouteResponse extends OSRMBaseResponse {
    waypoints?: OSRMWayPoint[]
    routes?: OSRMRoute[]
}

interface OSRMRoute {
    geometry?: string | Geometry
    legs?: OSRMLeg[]
    distance?: number
    duration?: number
}

interface OSRMLeg {
    distance?: number
    duration?: number
    summary?: string
    steps?: OSRMStep[]
    annotation?: OSRMAnnotation
}

interface OSRMStep {
    geometry?: string | Geometry
    maneuver?: OSRMManeuver
    distance?: number
    duration?: number
    name?: number
    ref?: number | string
    pronunciation?: string
    destinations?: any
    mode?: string
    intersections?: OSRMIntersections[]
}

interface OSRMIntersections {
    location?: number[]
    bearings?: number[]
    entry?: boolean[]
    in?: number
    out?: number
    lanes?: OSRMLane[]
}

interface OSRMLane {
    indications?: string[]
    valid?: boolean
}

interface OSRMManeuver {
    bearing_after?: number
    bearing_before?: number
    location?: number[]
    modifier?: string
    type?: string
    exit?: number
}
interface OSRMWayPoint {
    hint?: string
    distance?: number
    name: string
    location: number[]
}

interface OSRMAnnotation {
    distance?: number
    duration?: number
    datasources?: number[]
    nodes?: number[]
}

interface OSRMTableParams extends OSRMBaseParams {
    sources: number[]
    destinations: number[]
}

export interface OSRMTableResponse extends OSRMBaseResponse {
    durations: number[][]
    sources: OSRMWayPoint[]
    destinations: OSRMWayPoint[]
}

type OSRMResponseCode =
    | "Ok"
    | "InvalidUrl"
    | "InvalidService"
    | "InvalidVersion"
    | "InvalidOptions"
    | "InvalidQuery"
    | "InvalidValue"
    | "NoSegment"
    | "TooBig"
