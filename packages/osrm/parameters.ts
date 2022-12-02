import { LineString } from "geojson"

interface OSRMBaseParams {
    /**
     * String of format `{longitude},{latitude};{longitude},{latitude}[;{longitude},{latitude} ...]`
     *  or `polyline({polyline})`.
     */
    coordinates: string
    /**
     * Mode of transportation, is determined statically by the Lua profile that is used to prepare
     * the data using osrm-extract. Typically car, bike or foot if using one of the supplied profiles.
     */
    profile: string
    /**
     * Limits the search to segments with given bearing in degrees towards true north in
     * clockwise direction.
     */
    bearings?: string
    /** Limits the search to given radius in meters. */
    radiuses?: string
    /** Hint from previous request to derive position in street network. */
    hint?: string
}

export interface OSRMRouteParams extends OSRMBaseParams {
    /**
     * Search for alternative routes and return as well.
     *
     * @remarks
     * Please note that even if an alternative route is requested, a result cannot be guaranteed.
     */
    alternatives?: string
    /** Return route steps for each route leg */
    steps?: string
    /** Returns additional metadata for each coordinate along the route geometry. */
    annotations?: string
    /** Returned route geometry format (influences overview and per step) */
    geometries?: OSRMGeometryType
    /**
     * Add overview geometry either full, simplified according to highest zoom level it
     * could be display on, or not at all.
     */
    overview?: OSRMOverviewType
    /**
     * Forces the route to keep going straight at waypoints constraining uturns there even if
     * it would be faster. Default value depends on the profile.
     */
    continue_straight?: string
}

export type OSRMGeometryType = "polyline" | "polyline6" | "geojson"
export type OSRMOverviewType = "simplified" | "full" | "false"

interface OSRMBaseResponse {
    /**
     * Every response object has a code field containing one of the strings below or a
     * service dependent code:
     */
    code: OSRMResponseCode
    /** Optional human-readable error message. All other status types are service dependent. */
    message?: string
}

export interface OSRMRouteResponse extends OSRMBaseResponse {
    /** Array of Waypoint objects representing all waypoints in order */
    waypoints?: OSRMWayPoint[]
    /**
     * An array of Route objects, ordered by descending recommendation rank.
     */
    routes: OSRMRoute[]
}

export interface OSRMRoute {
    /**
     * The whole geometry of the route value depending on overview parameter, format depending
     * on the geometries parameter. See RouteStep's geometry field for a parameter documentation.
     */
    geometry?: string | OSRMGeometryObject
    /** The legs between the given waypoints, an array of RouteLeg objects. */
    legs: OSRMLeg[]
    /** The distance traveled by the route, in float meters. */
    distance: number
    /** The estimated travel time, in float number of seconds. */
    duration: number
}

export interface OSRMGeometryObject {
    coordinates: [number, number][]
    type: "LineString"
}

/** Represents a route between two waypoints. */
interface OSRMLeg {
    /** The distance traveled by this route leg, in float meters. */
    distance?: number
    /** The estimated travel time, in float number of seconds. */
    duration?: number
    /** Summary of the route taken as string. Depends on the steps parameter */
    summary?: string
    /** Depends on the `steps` parameter */
    steps?: OSRMStep[]
    /** Additional details about each coordinate along the route geometry */
    annotation?: OSRMAnnotation
}

interface OSRMStep {
    geometry?: string | LineString
    maneuver?: OSRMManeuver
    /** The distance of travel from the maneuver to the subsequent step, in float meters */
    distance?: number
    /** The estimated travel time, in float number of seconds. */
    duration?: number
    /** The name of the way along which travel proceeds. */
    name?: number
    /** A reference number or code for the way. Optionally included, if ref data is available for the given way. */
    ref?: number | string
    /** The pronunciation hint of the way name. Will be undefined if there is no pronunciation hit. */
    pronunciation?: string
    /** The destinations of the way. Will be undefined if there are no destinations. */
    destinations?: any
    /**  A string signifying the mode of transportation. */
    mode?: string
    /** A StepManeuver object representing the maneuver. */
    intersections?: OSRMIntersections[]
}

/**
 * An intersection gives a full representation of any cross-way the path passes bay. For every step,
 * the very first intersection (intersections[0]) corresponds to the location of the StepManeuver.
 * Further intersections are listed for every cross-way until the next turn instruction.
 */
interface OSRMIntersections {
    /** A [longitude, latitude] pair describing the location of the turn. */
    location?: number[]
    /**
     * A list of bearing values (e.g. [0,90,180,270]) that are available at the intersection. The
     * bearings describe all available roads at the intersection.
     */
    bearings?: number[]
    /**
     * A list of entry flags, corresponding in a 1:1 relationship to the bearings. A value of true
     * indicates that the respective road could be entered on a valid route. false indicates that
     * the turn onto the respective road would violate a restriction.
     */
    entry?: boolean[]
    /**
     * index into bearings/entry array. Used to calculate the bearing just before the turn.
     */
    in?: number
    /** index into the bearings/entry array. Used to extract the bearing just after the turn.  */
    out?: number
    /**
     * Array of Lane objects that denote the available turn lanes at the intersection. If no lane
     * information is available for an intersection, the lanes property will not be present
     */
    lanes?: OSRMLane[]
}

/** A Lane represents a turn lane at the corresponding turn location. */
interface OSRMLane {
    /** a indication (e.g. marking on the road) specifying the turn lane. */
    indications?: string[]
    /** a boolean flag indicating whether the lane is a valid choice in the current maneuver */
    valid?: boolean
}

interface OSRMManeuver {
    /**  The clockwise angle from true north to the direction of travel immediately before the maneuver. */
    bearing_after?: number
    /** The clockwise angle from true north to the direction of travel immediately after the maneuver. */
    bearing_before?: number
    /** A [longitude, latitude] pair describing the location of the turn. */
    location?: [number, number]
    /** An optional string indicating the direction change of the maneuver. */
    modifier?: string
    /**
     * A string indicating the type of maneuver. new identifiers might be introduced without API
     * change Types unknown to the client should be handled like the turn type, the existance of
     * correct modifier values is guranteed.
     */
    type?: string
    /** exit An optional integer indicating number of the exit to take.  */
    exit?: number
}
interface OSRMWayPoint {
    /**
     * Unique internal identifier of the segment (ephemeral, not constant over data updates)
     * This can be used on subsequent request to significantly speed up the query and to connect
     * multiple services. E.g. you can use the hint value obtained by the nearest query as hint
     * values for route inputs.
     */
    hint?: string
    /** The distance of the snapped point from the original */
    distance?: number
    /** Name of the street the coordinate snapped to */
    name: string
    /** location Array that contains the [longitude, latitude] pair of the snapped coordinate */
    location: number[]
}

/**
 * Annotation of the whole route leg with fine-grained information about each segment or node id.
 */
interface OSRMAnnotation {
    /** The distance, in metres, between each pair of coordinates */
    distance?: number
    /** The duration between each pair of coordinates, in seconds */
    duration?: number
    /**
     * The index of the datasource for the speed between each pair of coordinates. 0 is the default
     * profile, other values are supplied via `--segment-speed-file` to `osrm-contract`
     */
    datasources?: number[]
    /**
     * The OSM node ID for each coordinate along the route, excluding the first/last user-supplied
     * coordinates
     */
    nodes?: number[]
}

export interface OSRMTableParams extends OSRMBaseParams {
    /** Use location with given index as source. */
    sources: string
    /** Use location with given index as destination. */
    destinations: string
}

export interface OSRMTableResponse extends OSRMBaseResponse {
    /**
     * array of arrays that stores the matrix in row-major order. durations[i][j] gives the travel
     * time from the i-th waypoint to the j-th waypoint. Values are given in seconds.
     */
    durations: number[][]
    distances: number[][]
    /** array of Waypoint objects describing all sources in order */
    sources: OSRMWayPoint[]
    /** array of Waypoint objects describing all destinations in order */
    destinations: OSRMWayPoint[]
}

type OSRMResponseCode =
    /** Request could be processed as expected. */
    | "Ok"
    /** URL string is invalid. */
    | "InvalidUrl"
    /** Service name is invalid. */
    | "InvalidService"
    /** Version is not found. */
    | "InvalidVersion"
    /** Options are invalid. */
    | "InvalidOptions"
    /** The query string is synctactically malformed. */
    | "InvalidQuery"
    /** The successfully parsed query parameters are invalid. */
    | "InvalidValue"
    /** One of the supplied input coordinates could not snap to street segment. */
    | "NoSegment"
    /** The request size violates one of the service specific request size restrictions. */
    | "TooBig"
