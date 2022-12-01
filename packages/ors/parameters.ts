import { Feature, Geometry, LineString } from "geojson"

/** Specifies the mode of transport. */
export type ORSProfile =
    | "driving-car"
    | "driving-hgv"
    | "foot-walking"
    | "foot-hiking"
    | "cycling-regular"
    | "cycling-road"
    | "cycling-mountain"
    | "cycling-electric"

interface ORSBaseParams {
    /** Arbitrary identification string of the request reflected in the meta information. */
    id?: string
    /**
     * Specifies the distance units only if range_type is set to distance.
     *
     * @defaultValue
     * Default: m.
     */
    units?: ORSUnit
}

export interface ORSRouteParams extends ORSBaseParams {
    /** The locations to use for the route as an array of longitude/latitude pairs */
    coordinates: [number, number][]
    /**
     * Specifies whether alternative routes are computed, and parameters for the algorithm determining
     * suitable alternatives.
     */
    alternative_routes?: ORSAlternateRouteParam
    /** List of route attributes */
    attrributes?: ORSAttribute[]
    continue_straight?: boolean
    options?: object
    elevation?: boolean
    extra_info?: ORSExtraInfo[]
    geometry_simplify?: boolean
    instructions?: boolean
    instructions_format?: ORSInstructionFormat
    language?: string
    maneuvers?: boolean
    preference?: ORSPreference
    radiuses?: number[]
    roundabout_exits?: boolean
    skip_segments?: number[]
    suppress_warnings?: boolean
    geometry?: boolean
    maximum_speed?: number
}

export interface ORSIsochroneParams extends ORSBaseParams {
    locations: [number, number][]
    range: number[]
    attributes?: ORSIsoAttribute[]
    intersections?: boolean
    interval?: number
    location_type?: "start" | "destination"
    range_type?: "time" | "distance"
    smoothing?: number
    options?: object
    area_units?: ORSUnit
    time?: string
}

export interface ORSMatrixParams extends ORSBaseParams {
    locations: [number, number][]
    destinations?: number[]
    metrics?: ("distance" | "duration")[]
    resolve_locations?: boolean
    sources?: number[]
}

export interface ORSAlternateRouteParam {
    share_factor: number
    target_count: number
    weight_factor: number
}

export type ORSPreference = "fastest" | "shortest" | "recommended"
export type ORSUnit = "m" | "km" | "mi"
export type ORSAttribute = "avgspeed" | "detourfactor" | "percentage"
export type ORSExtraInfo =
    | "steepness"
    | "suitability"
    | "surface"
    | "waycategory"
    | "waytype"
    | "tollways"
    | "traildifficulty"
    | "roadaccessrestrictions"
export type ORSInstructionFormat = "html" | "text"
export type ORSFormat = "geojson" | "json"
export type ORSIsoAttribute = "area" | "reachfactor" | "total_pop"

interface ORSBaseResponse {
    metadata: ORSMetaData
}

export interface ORSRouteResponse extends ORSBaseResponse {
    bbox: ORSBbox
    routes?: ORSRoute[]
    type?: "FeatureCollection"
    features?: Feature<LineString, any>[]
}

export interface ORSIsochroneResponse extends ORSBaseResponse {
    bbox: ORSBbox
    features: Feature<Geometry, any>[]
    type: string
}

export interface ORSMatrixResponse extends ORSBaseResponse {
    sources: ORSMatrixResult[]
    destinations: ORSMatrixResult[]
    distances: number[][]
    durations: number[][]
}

interface ORSMatrixResult {
    location: [number, number]
    name?: string
    snapped_distance?: number
}

interface ORSMetaData {
    attribution: string
    engine: ORSEngine
    id: string
    osm_file_md5_hash: string
    query: ORSRouteParams
    service: string
    system_message: string
    timestamp: number
}

interface ORSEngine {
    build_date: string
    graph_date: string
    version: string
}

export interface ORSRoute {
    arrival: string
    bbox: ORSBbox
    departure: string
    extras: object[]
    segments: ORSSegment
    summary: ORSSummary
    warnings?: ORSWarning[]
    way_points?: number[]
    geometry?: string
}

interface ORSSegment {
    ascent: number
    avgspeed: number
    descent: number
    detourfactor: number
    distance: number
    duration: number
    percentage: number
    steps: ORSStep[]
}

interface ORSStep {
    distance: number
    duration: number
    extra_bearings: number[]
    exit_number: number
    instruction: string
    maneuver?: ORSManeuver
}

interface ORSManeuver {
    bearing_after: number
    bearing_before: number
    location: [number, number]
    name: string
    type: number
    way_points: number[]
}

interface ORSSummary {
    ascent: number
    descent: number
    distance: number
    duration: number
}

interface ORSWarning {
    code: number
    message: string
}

type ORSBbox = [number, number, number, number]
