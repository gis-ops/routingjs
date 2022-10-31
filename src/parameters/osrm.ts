interface OSRMBaseParams {
    coordinates: string
    profile: string
    bearings?: string
    radiuses?: string
    hint?: string
}

export interface OSRMRouteParams extends OSRMBaseParams {
    alternatives?: string
    steps?: string
    annotations?: string
    geometries?: OSRMGeometryType
    overview?: OSRMOverviewType
    continue_straight?: string
}

export type OSRMGeometryType = "polyline" | "polyline6" | "geojson"
export type OSRMOverviewType = "simplified" | "full" | "false"

interface OSRMBaseResponse {
    code: OSRMResponseCode
}

export interface OSRMRouteResponse extends OSRMBaseResponse {
    waypoints?: OSRMWayPoint[]
    routes: OSRMRoute[]
}

export interface OSRMRoute {
    geometry: string | OSRMGeometryObject
    legs: OSRMLeg[]
    distance: number
    duration: number
}

export interface OSRMGeometryObject {
    coordinates: [number, number][]
    type: "LineString"
}

interface OSRMLeg {
    distance?: number
    duration?: number
    summary?: string
    steps?: OSRMStep[]
    annotation?: OSRMAnnotation
}

interface OSRMStep {
    geometry?: string | { [k: string]: any }
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

export interface OSRMTableParams extends OSRMBaseParams {
    sources: string
    destinations: string
}

export interface OSRMTableResponse extends OSRMBaseResponse {
    durations: number[][]
    distances: number[][]
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
