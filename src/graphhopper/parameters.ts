import { Feature, LineString, Polygon } from "geojson"

/**
 * Request parameters common across `/route`, `/isochrone` and `/matrix` endpoints.
 */
interface GraphHopperBaseParams {
    /** The vehicle for which the route should be calculated. */
    profile: GraphHopperProfile
}

/**
 * All parameters accepted by the `/route` endpoint
 */
export interface GraphHopperRouteParams extends GraphHopperBaseParams {
    /** The points for the route in an array of [longitude,latitude]. */
    points: [number, number][]
    /**
     * Specifies a hint for each point in the points array to prefer a
     * certain street for the closest location lookup. E.g. if there is an
     * address or house with two or more neighboring streets you can control for
     * which street the closest location is looked up. Make sure you do not
     * include the house number of city name and only the street name to improve the
     * quality of the matching.
     */
    point_hints?: string[]
    /** Parameter to avoid snapping to a certain road class or road environment */
    snap_preventions?: GraphHopperSnapPrevention[]
    /**
     * Specifies on which side a point should be relative to the driver when she
     * leaves/arrives at a start/target/via point. You need to specify this parameter
     * for either none or all points. Only supported for motor vehicle profiles and OpenStreetMap.
     */
    curbsides?: GraphHopperCurbside[]
    /** The locale of the resulting turn instructions. Defaults to "en". */
    locale?: string
    /**
     * If true, a third coordinate, the altitude, is included with all positions in the response.
     * This changes the format of the points and snapped_waypoints fields of the response, in both
     * their encodings. Unless you switch off the points_encoded parameter, you need special code on
     * the client side that can handle three-dimensional coordinates.
     *
     * @defaultValue
     * Defaults to false.
     */
    elevation?: boolean
    /** Enables additional attributes to be added to the returned path(s). */
    details?: GraphHopperDetail[]
    /**
     * Normally, the calculated route will visit the points in the order you specified them.
     * If you have more than two points, you can set this parameter to "true" and the points may
     * be re-ordered to minimize the total travel time. Keep in mind that the limits on the number
     * of locations of the Route Optimization API applies, and the request costs more credits.
     *
     * @defaultValue
     * Defaults to false.
     */
    optimize?: boolean
    /**
     * If true, detailed instructions are returned.
     * @defaultValue
     * Defaults to false.
     */
    instructions?: boolean
    /**
     * Whether the points for the route should be calculated at all. If true, only returns
     * time and distance.
     *
     * @defaultValue
     * Defaults to false.
     */
    calc_points?: boolean
    /**
     * If true, output will be formatted.
     * @defaultValue
     * Defaults to false.
     */
    debug?: boolean
    /**
     * If `False` the coordinates in point and snapped_waypoints are returned as array using the order
     * [lon,lat,elevation] for every point. If true the coordinates will be encoded as string leading to less bandwith usage.
     * @defaultValue
     * Defaults to true.
     */
    points_encoded?: boolean
    /**
     * If certain optional parameters are set, contraction hierarchies need to be disabled using this flag.
     * Is detected automatically in the `.directions()` method, so no need to pass explicitly.
     *
     * @defaultValue
     * Defaults to false.
     */
    "ch.disable"?: boolean
    /**
     * The custom_model modifies the routing behaviour of the specified profile.
     *
     * @see {@link https://docs.graphhopper.com/#section/Custom-Model} for full documentation.
     */
    custom_model?: GraphHopperCustomModel
    /**
     * Favour a heading direction for a certain point. Specify either one heading for the start
     * point or as many as there are points. In this case headings are associated by their order
     * to the specific points. Headings are given as north based clockwise angle between 0 and 360
     * degree. This parameter also influences the tour generated with algorithm=round_trip and forces
     * the initial direction.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     *
     */
    headings?: number[]
    /**
     * Time penalty in seconds for not obeying a specified heading.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     *
     * @defaultValue
     * Defaults to 120.
     *
     */
    heading_penalty?: number
    /**
     * If true, u-turns are avoided at via-points with regard to the heading_penalty.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     *
     * @defaultValue
     * Defaults to false.
     *
     */
    pass_through?: boolean
    /**
     * Rather than looking for the shortest or fastest path, this parameter lets you solve two
     * different problems related to routing: With alternative_route, we give you not one but several
     * routes that are close to optimal, but not too similar to each other. With round_trip, the
     * route will get you back to where you started. This is meant for fun (think of a bike trip),
     * so we will add some randomness.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     *
     *
     */
    algorithm?: GraphHopperAlgorithm
    /**
     * This parameter configures approximative length of the
     * resulting round trip.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     * Requires `algorithm=round_trip`.
     *
     * @defaultValue
     * Defaults to 10000.
     */
    "round_trip.distance"?: number
    /**
     * This sets the random seed. Change this to get a different tour for each value.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     * Requires `algorithm=round_trip`.
     */
    "round_trip.seed"?: number
    /**
     * This parameter sets the number of maximum
     * paths which should be calculated. Increasing can lead to worse alternatives.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     * Requires `algorithm=alternative_route`.
     *
     * @defaultValue
     * Defaults to 2.
     *
     */
    "alternative_route.max_paths"?: number
    /**
     * This parameter sets the factor by which the alternatives routes can be longer
     * than the optimal route. Increasing can lead to worse alternatives.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     * Requires `algorithm=alternative_route`.
     *
     * @defaultValue
     * Defaults to 1.4.
     *
     */
    "alternative_route.max_weight_factor"?: number
    /**
     * This parameter specifies how similar an alternative route can be to the optimal route.
     * Increasing can lead to worse alternatives.
     *
     * @remarks
     *
     * Requires `ch.disabled = true`.
     * Requires `algorithm=alternative_route`.
     *
     * @defaultValue
     * Defaults to 0.6.
     *
     */
    "alternative_route.max_share_factor"?: number
}

/**
 * All parameters accepted by the `/isocrhone` endpoint
 */
export interface GraphHopperIsochroneParams extends GraphHopperBaseParams {
    /** A single Lon/Lat tuple. */
    point: [number, number]
    /**
     * Specify which time the vehicle should travel. In seconds.
     *
     * @defaultValue
     * Defaults to 600.
     */
    time_limit?: number
    /** Specify which distance the vehicle should travel. In meters. */
    distance_limit?: number
    /**
     * Number by which to divide the given `time_limit` / `distance_limit` to create buckets nested
     * isochrones of time intervals `limit-n * limit / buckets`.
     *
     * @defaultValue
     * Defaults to 1.
     */
    buckets?: number
    /**
     * If false the flow goes from point to the polygon, if true the flow goes from the
     * polygon "inside" to the point.
     *
     * @defaultValue
     * Defaults to false.
     */
    reverse_flow?: boolean
}

/**
 * Since the `/isochrone` endpoint only accepts GET requests,
 * all parameters need to be stringified.
 */
export type GraphHopperIsochroneGetParams = {
    [K in keyof GraphHopperIsochroneParams]: string
}

/**
 * All parameters accepted by the `/matrix` endpoint.
 */
export interface GraphHopperMatrixParams extends GraphHopperBaseParams {
    /**
     * The starting points for the routes in an array of [longitude,latitude].
     * For instance, if you want to calculate three routes from point A such as A->1, A->2, A->3
     * then you have one from_point parameter and three to_point parameters.
     */
    from_points: [number, number][]
    /**
     * The destination points for the routes in an array of [longitude,latitude].
     */
    to_points: [number, number][]
    /**
     * Specifies a hint for each `from_point` parameter to prefer a certain street for the closest
     * location lookup. E.g. if there is an address or house with two or more neighboring streets
     * you can control for which street the closest location is looked up.
     *
     * @remarks
     * Array length needs to match `from_points` array length.
     */
    from_point_hints?: string[]
    /**
     * Specifies a hint for each `from_point` parameter to prefer a certain street for the closest
     * location lookup. E.g. if there is an address or house with two or more neighboring streets
     * you can control for which street the closest location is looked up.
     *
     * @remarks
     * Array length needs to match `from_points` array length.
     */
    to_point_hints?: string[]
    /**
     * Optional parameter to avoid snapping to a certain road class or road environment.
     * Multiple values are specified like `snap_prevention=ferry&snap_prevention=motorway`.
     * Please note that this feature does not e.g. avoid motorways for the route - it
     * only avoids it for the "location snap".
     *
     * @remarks
     * Array length needs to match `from_points` array length.
     */
    snap_preventions?: string[]
    /**
     * Specifies on which side a point should be relative to the driver when she leaves/arrives
     * at a start/target/via point. You need to specify this parameter for either none or all points.
     * Only supported for motor vehicles and OpenStreetMap.
     *
     * @remarks
     * Array length needs to match `from_points` array length.
     */
    from_curbsides?: GraphHopperCurbside[]
    /**
     * Specifies on which side a point should be relative to the driver when she leaves/arrives
     * at a start/target/via point. You need to specify this parameter for either none or all points.
     * Only supported for motor vehicles and OpenStreetMap.
     *
     * @remarks
     * Array length needs to match `from_points` array length.
     */
    to_curbsides?: GraphHopperCurbside[]
    /**
     * Specifies which arrays should be included in the response. Specify one or more of
     * the following options 'weights', 'times', 'distances'. To specify more than one array
     * use e.g. out_array=times&out_array=distances. The units of the entries of distances
     * are meters, of times are seconds and of weights is arbitrary and it can differ for different
     * vehicles or versions of this API.
     */
    out_arrays?: GraphHopperMatrixOut[]
    /**
     * Specifies whether or not the matrix calculation should return with an error as soon as
     * possible in case some points cannot be found or some points are not connected. If set
     * to false the time/weight/distance matrix will be calculated for all valid points and contain
     * the null value for all entries that could not be calculated. The hint field of the response
     * will also contain additional information about what went wrong.
     *
     * @defaultValue
     * Defaults to true.
     */
    fail_fast?: boolean
}

export interface GraphHopperRouteResponse {
    hints?: { [k: string]: any }
    paths: GraphHopperRoutePath[]
    info: GraphHopperResponseInfo
}

export interface GraphHopperIsochroneResponse {
    polygons: Feature<Polygon, GraphHopperIsochroneProps>[]
    copyrights: string[]
}

export interface GraphHopperMatrixResponse {
    distances?: number[][]
    times?: number[][]
    weights?: number[][]
    info: GraphHopperResponseInfo
    hints?: GraphHopperMatrixHint[]
}

export type GraphHopperProfile =
    | "car"
    | "car_delivery"
    | "car_avoid_ferry"
    | "car_avoid_motorway"
    | "car_avoid_toll"
    | "small_truck"
    | "small_truck_delivery"
    | "truck"
    | "scooter"
    | "scooter_delivery"
    | "foot"
    | "hike"
    | "bike"
    | "mtb"
    | "racingbike"

type GraphHopperCurbside = "any" | "right" | "left"

type GraphHopperDetail =
    | "street_name"
    | "street_ref"
    | "street_destination"
    | "roundabout"
    | "country"
    | "time"
    | "distance"
    | "max_speed"
    | "max_weight"
    | "max_width"
    | "toll"
    | "road_class"
    | "road_class_link"
    | "road_access"
    | "road_environment"
    | "hazmat"
    | "hazmat_tunnel"
    | "hazmat_water"
    | "lanes"
    | "surface"
    | "smoothness"
    | "hike_rating"
    | "mtb_rating"
    | "foot_network"
    | "bike_network"
    | "get_off_bike"

interface GraphHopperCustomModel {
    [k: string]: any
}

type GraphHopperSnapPrevention =
    | "motorway"
    | "trunk"
    | "ferry"
    | "tunnel"
    | "bridge"
    | "ford"

type GraphHopperAlgorithm = "round_trip" | "alternative_route"

export interface GraphHopperRoutePath {
    /**
     * The total distance, in meters.
     *
     * @see {@link https://www.graphhopper.com/blog/2019/11/28/routing-api-using-path-details/} for more details.
     *
     */
    distance: number
    /**
     * The total travel time, in milliseconds.
     *
     * @see {@link https://www.graphhopper.com/blog/2019/11/28/routing-api-using-path-details/} for more details.
     */
    time: number
    /** The total ascent, in meters. */
    ascend: number
    /** The total descent, in meters.  */
    descend: number
    /** The geometry of the route. The format depends on the value of points_encoded. */
    points?: LineString | string // not returned if `calc_points=false`
    /** The snapped input points. The format depends on the value of points_encoded. */
    snapped_waypoints: LineString | string
    /**
     * Whether the points and snapped_waypoints fields are polyline-encoded strings rather than
     * JSON arrays of coordinates. See the field description for more information on the two formats.
     */
    points_encoded: boolean
    /** The bounding box of the route geometry. */
    bbox: [number, number, number, number]
    /**
     * The instructions for this route. This feature is under active development, and our
     * instructions can sometimes be misleading, so be mindful when using them for navigation.
     */
    instructions: GraphHopperInstruction[]
    /**
     * Details, as requested with the details parameter.
     * Consider the value `{"street_name": [[0,2,"Frankfurter Straße"],[2,6,"Zollweg"]]}`.
     * In this example, the route uses two streets: The first, Frankfurter Straße, is used
     * between points[0] and points[2], and the second, Zollweg, between points[2] and points[6].
     */
    details: { [Property in keyof GraphHopperDetail]: any }
    /**
     * An array of indices (zero-based), specifiying the order in which the input points are visited.
     * Only present if the optimize parameter was used.
     */
    points_order: number[]
}

interface GraphHopperInstruction {
    text: string
    street_name: string
    distance: number
    time: number
    interval: [number, number]
    sign: number
    exit_number: number
    turn_angle: number
}

interface GraphHopperResponseInfo {
    copyright: string
    took: number
}

/**
 * Properties of the returned Features.
 */
interface GraphHopperIsochroneProps {
    bucket: number
}
type GraphHopperMatrixOut = "weights" | "times" | "distances"

interface GraphHopperMatrixHint {
    message: string
    details: string
    invalid_from_points?: number[]
    invalid_to_points?: number[]
    point_pairs?: [number, number][]
}
