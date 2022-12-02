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
    /** Forces the route to keep going straight at waypoints restricting uturns there even if it would be faster. */
    continue_straight?: boolean
    /**
     * For advanced options formatted as json object.
     *
     * @see {@link https://giscience.github.io/openrouteservice/documentation/routing-options/Examples.html} for examples.
     */
    options?: object
    /**
     * Specifies whether to return elevation values for points. Please note that elevation also gets
     * encoded for json response encoded polyline.
     */
    elevation?: boolean
    /** The extra info items to include in the response */
    extra_info?: ORSExtraInfo[]
    /**
     * Specifies whether to simplify the geometry. Simplify geometry cannot be applied to routes
     * with more than one segment and when extra_info is required.
     */
    geometry_simplify?: boolean
    /** Specifies whether to return instructions. */
    instructions?: boolean
    /** Select html for more verbose instructions. */
    instructions_format?: ORSInstructionFormat
    /** Language for the route instructions. */
    language?: string
    /**
     * Specifies whether the maneuver object is included into the step object or not.
     *
     * @defaultValue
     * false
     */
    maneuvers?: boolean
    /** Specifies the route preference. */
    preference?: ORSPreference
    /**
     * A list of maximum distances (measured in metres) that limit the search of nearby road segments
     * to every given waypoint. The values must be greater than 0, the value of -1 specifies using the
     * maximum possible search radius. The number of radiuses correspond to the number of waypoints.
     * If only a single value is given, it will be applied to all waypoints.
     */
    radiuses?: number[]
    /**
     * Provides bearings of the entrance and all passed roundabout exits. Adds the exit_bearings
     * array to the step object in the response.
     */
    roundabout_exits?: boolean
    /**
     * Specifies the segments that should be skipped in the route calculation. A segment is the
     * connection between two given coordinates and the counting starts with 1 for the connection
     * between the first and second coordinate.
     */
    skip_segments?: number[]
    /**
     * Suppress warning messages in the response
     *
     * @defaultValue
     * false
     */
    suppress_warnings?: boolean
    /**
     * Specifies whether to return geometry.
     *
     * @defaultValue
     * true
     */
    geometry?: boolean
    /**
     * The maximum speed specified by user.
     */
    maximum_speed?: number
}

export interface ORSIsochroneParams extends ORSBaseParams {
    /**
     * The locations to use for the route as an array of longitude/latitude pairs
     */
    locations: [number, number][]
    /**
     * Maximum range value of the analysis in seconds for time and metres for distance. Alternatively
     * a comma separated list of specific range values. Ranges will be the same for all locations.
     */
    range: number[]
    /** List of isochrones attributes */
    attributes?: ORSIsoAttribute[]
    /**
     * Specifies whether to return intersecting polygons.
     *
     * @defaultValue
     * false
     */
    intersections?: boolean
    /**
     * Interval of isochrones or equidistants. This is only used if a single range value is given.
     * Value in seconds for time and meters for distance.
     *
     * @defaultValue
     * false
     */
    interval?: number
    /**
     * start treats the location(s) as starting point, destination as goal.
     *
     * @defaultValue
     * start
     */
    location_type?: "start" | "destination"
    /** Specifies the isochrones reachability type. */
    range_type?: "time" | "distance"
    /**
     * Applies a level of generalisation to the isochrone polygons generated as a `smoothing_factor`
     * between 0 and 100.0.
     */
    smoothing?: number
    /** Additional options for the isochrones request */
    options?: object
    /**
     * Specifies the area unit.
     * @defaultValue
     * m
     */
    area_units?: ORSUnit
    /** Departure date and time provided in local time zone */
    time?: string
}

export interface ORSMatrixParams extends ORSBaseParams {
    /** List of comma separated lists of longitude,latitude coordinates. */
    locations: [number, number][]
    /**
     * A list of indices that refers to the list of locations (starting with 0).
     * `{index_1},{index_2}[,{index_N} ...]` or all (default). `[0,3]` for the first and
     * fourth locations
     *
     * @defaultValue
     * all
     */
    destinations?: number[]
    /**
     * Arbitrary identification string of the request reflected in the meta information.
     */
    metrics?: ("distance" | "duration")[]
    /**
     * Specifies whether given locations are resolved or not. If the parameter value set to true,
     * every element in destinations and sources will contain a name element that identifies the name
     * of the closest street.
     *
     * @defaultValue
     * Default is false.
     */
    resolve_locations?: boolean
    /**
     * A list of indices that refers to the list of locations (starting with 0).
     * `{index_1},{index_2}[,{index_N} ...]` or all (default). `[0,3]` for the first and
     * fourth locations
     *
     * @defaultValue
     * all
     */
    sources?: number[]
}

export interface ORSAlternateRouteParam {
    share_factor: number
    /** Number of alternative routes (up to 3) */
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
    /** Information about the service and request  */
    metadata: ORSMetaData
}

export interface ORSRouteResponse extends ORSBaseResponse {
    bbox: ORSBbox
    /** A list of routes returned from the request  */
    routes?: ORSRoute[]
    /** If the `/geojson` endpoint was requested */
    type?: "FeatureCollection"
    /** If the `/geojson` endpoint was requested */
    features?: Feature<LineString, any>[]
}

export interface ORSIsochroneResponse extends ORSBaseResponse {
    /** Bounding box that covers all returned isochrones */
    bbox: ORSBbox
    /** The features containing the isochrone/isodistance geometries */
    features: Feature<Geometry, any>[]
    /** FeatureCollection */
    type: string
}

export interface ORSMatrixResponse extends ORSBaseResponse {
    /** The individual sourcesof the matrix calculations.  */
    sources: ORSMatrixResult[]
    /** The individual destinations of the matrix calculations.  */
    destinations: ORSMatrixResult[]
    /** The distances of the matrix calculations. */
    distances: number[][]
    /** The durations of the matrix calculations. */
    durations: number[][]
}

interface ORSMatrixResult {
    /**
     * `{longitude},{latitude}` coordinates of the closest accessible point on the routing graph
     */
    location: [number, number]
    /**
     * Name of the street the closest accessible point is situated on. Only for `resolve_locations=true`
     * and only if name is available.
     */
    name?: string
    /** Distance between the source/destination Location and the used point on the routing graph. */
    snapped_distance?: number
}

interface ORSMetaData {
    /** Copyright and attribution information */
    attribution: string
    /** Information about the routing service  */
    engine: ORSEngine
    /** ID of the request (as passed in by the query) */
    id: string
    /** The MD5 hash of the OSM planet file that was used for generating graphs */
    osm_file_md5_hash: string
    /** The information that was used for generating the route */
    query: ORSRouteParams
    /** The service that was requested */
    service: string
    /** System message */
    system_message: string
    /** Time that the request was made (UNIX Epoch time) */
    timestamp: number
}

interface ORSEngine {
    /** The date that the service was last updated */
    build_date: string
    /** The date that the graph data was last updated */
    graph_date: string
    /** The backend version of the openrouteservice that was queried */
    version: string
}

export interface ORSRoute {
    /** Arrival date and time */
    arrival: string
    /** A bounding box which contains the entire route */
    bbox: ORSBbox
    /** Departure date and time */
    departure: string
    /**
     * List of extra info objects representing the extra info items that were requested for the route.
     */
    extras: object[]
    /** List containing the segments and its corresponding steps which make up the route.  */
    segments: ORSSegment[]
    /** Summary information about the route  */
    summary: ORSSummary
    /** List of warnings that have been generated for the route  */
    warnings?: ORSWarning[]
    /** List containing the indices of way points corresponding to the geometry. */
    way_points?: number[]
    /** The route geometry as a decoded polyline */
    geometry?: string
}

interface ORSSegment {
    /** Contains ascent of this segment in metres. */
    ascent: number
    /** Contains the average speed of this segment in km/h. */
    avgspeed: number
    /** Contains descent of this segment in metres. */
    descent: number
    /**
     * Contains the deviation compared to a straight line that would have the factor 1. Double
     * the Distance would be a 2.
     */
    detourfactor: number
    /** Contains the distance of the segment in specified units. */
    distance: number
    /** Contains the duration of the segment in seconds. */
    duration: number
    /** Contains the proportion of the route in percent. */
    percentage: number
    /** List containing the specific steps the segment consists of.  */
    steps: ORSStep[]
}

interface ORSStep {
    /** The distance for the step in metres. */
    distance: number
    /** The duration for the step in seconds. */
    duration: number
    /** Contains the bearing of the entrance and all passed exits in a roundabout */
    extra_bearings: number[]
    /** Only for roundabouts. Contains the number of the exit to take. */
    exit_number: number
    /** The routing instruction text for the step. */
    instruction: string
    /** The maneuver to be performed  */
    maneuver?: ORSManeuver
    /** The name of the next street. */
    name: string
    /** The instruction action for symbolisation purposes. */
    type: number
    /**
     * List containing the indices of the steps start- and endpoint corresponding to the geometry.
     */
    way_points: number[]
}

interface ORSManeuver {
    /** The azimuth angle (in degrees) of the direction right after the maneuver. */
    bearing_after: number
    /** The azimuth angle (in degrees) of the direction right before the maneuver. */
    bearing_before: number
    /** The coordinate of the point where a maneuver takes place. */
    location: [number, number]
}

interface ORSSummary {
    /** Total ascent in meters. */
    ascent: number
    /** Total descent in meters. */
    descent: number
    /** Total route distance in specified units. */
    distance: number
    /** Total duration in seconds. */
    duration: number
}

interface ORSWarning {
    /** Identification code for the warning */
    code: number
    /** The message associated with the warning */
    message: string
}

type ORSBbox = [number, number, number, number]
