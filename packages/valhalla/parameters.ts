import { FeatureCollection } from "geojson"

/**
 * You specify locations as an ordered list of two or more locations within a JSON array.
 * Locations are visited in the order specified.
 */
export interface ValhallaRouteParams extends ValhallaRequestParams {
    /**
     * A location must include a latitude and longitude in decimal degrees. The coordinates can
     * come from many input sources, such as a GPS location, a point or a click on a map,
     * a geocoding service, and so on.
     *
     * @remarks
     * Note that the Valhalla cannot search for names or addresses or perform geocoding or
     * reverse geocoding.
     */
    locations: ValhallaLocation[]
    /**
     * Whether or not narrative instructions should be returned for the route
     *
     * @defaultValue
     * Defaults to false.
     */
    narrative?: boolean
    /**  Additional options specific to the `/route` endpoint */
    directions_options?: ValhallaDirectionsOptions
    /**
     * A number denoting how many alternate routes should be provided. There may be no alternates or
     * less alternates than the user specifies. Alternates are not yet supported on multipoint
     * routes (that is, routes with more than 2 locations). They are also not supported on time
     * dependent routes.
     */
    alternates?: number
    /**
     * This is the local date and time at the location.
     */
    date_time?: ValhallaDateTime
    /**
     * When present and true, the successful route response will include a key linear_references.
     * Its value is an array of base64-encoded OpenLR location references, one for each graph edge
     * of the road network matched by the input trace.
     */
    linear_references?: boolean
}

/**  Additional options specific to the `/route` endpoint */
interface ValhallaDirectionsOptions {
    /**
     * Distance units for output. Allowable unit types are miles (or mi) and kilometers (or km).
     * If no unit type is specified, the units default to kilometers.
     *
     * @defaultValue
     * Defaults to "kilometers".
     */
    units?: ValhallaRequestUnit
    /**
     * `none` indicates no maneuvers or instructions should be returned,
     * `maneuvers` indicates that only maneuvers be returned.
     * `instructions` indeicates that maneuvers with instructions should be returned
     *
     * @defaultValue
     * Defaults to `instructions`.
     */
    directions_type?: ValhallaDirectionsType
    /**
     * The language of the narration instructions based on the IETF BCP 47 language tag string.
     * If no language is specified or the specified language is unsupported, United States-based
     * English (en-US) is used.
     *
     * @see {@link https://valhalla.readthedocs.io/en/latest/api/turn-by-turn/api-reference/#supported-language-tags} for full list of supported languages.
     */
    language?: string
}

interface ValhallaRequestParams {
    /**
     * Valhalla's routing service uses dynamic, run-time costing to generate the route path. The route
     * request must include the name of the costing model and can include optional parameters available
     * for the chosen costing model.
     */
    costing: ValhallaCostingType
    /**
     * Costing methods can have several options that can be adjusted to develop the route path,
     * as well as for estimating time along the path.
     */
    costing_options?: ValhallaCostingOptTypes
    /**
     * Name your route request. If id is specified, the naming will be sent thru to the response.
     */
    id?: string
    /**
     * A set of locations to exclude or avoid within a route can be specified using a JSON array
     * of avoid_locations. The avoid_locations have the same format as the locations list. At a
     * minimum each avoid location must include latitude and longitude. The avoid_locations are
     * mapped to the closest road or roads and these roads are excluded from the route path computation.
     */
    exclude_locations?: [number, number][] | ValhallaLocation[]
    /**
     * One or multiple exterior rings of polygons in the form of nested JSON arrays, e.g.
     * [[[lon1, lat1], [lon2,lat2]],[[lon1,lat1],[lon2,lat2]]]. Roads intersecting these rings
     * will be avoided during path finding. If you only need to avoid a few specific roads,
     * it's much more efficient to use exclude_locations. Valhalla will close open rings (i.e.
     * copy the first coordingate to the last position).
     */
    exclude_polygons?: [number, number][][] | [number, number][][][]
}

export type ValhallaRequestUnit = "mi" | "km" | "miles" | "kilometers"

export interface ValhallaIsochroneParams extends ValhallaRequestParams {
    /** Only single location can be specified. */
    locations: [ValhallaLocation]
    /**
     * The local date and time at the location. These parameters apply only for multimodal
     * requests and are not used with other costing methods.
     */
    date_time?: ValhallaDateTime
    /**
     * A JSON array of contour objects with the time in minutes or distance in kilometers and
     * color to use for each isochrone contour. You can specify up to four contours (by default).
     */
    contours: ValhallaContours[]
    /**
     * A Boolean value to determine whether to return geojson polygons or linestrings as the contours.
     * The default is false, which returns lines; when true, polygons are returned.
     *
     * @remarks
     * When polygons is true, any contour that forms a ring is returned as a polygon.
     */
    polygons?: boolean
    /**
     * A floating point value from 0 to 1 (default of 1) which can be used to remove smaller contours.
     * A value of 1 will only return the largest contour for a given time value. A value of 0.5 drops
     * any contours that are less than half the area of the largest contour in the set of contours for
     * that same time value.
     */
    denoise?: number
    /**
     * A floating point value in meters used as the tolerance for Douglas-Peucker generalization.
     *
     * @remarks
     * Note: Generalization of contours can lead to self-intersections, as well as intersections of
     * adjacent contours.
     */
    generalize?: number
    /**
     * A boolean indicating whether the input locations should be returned as MultiPoint features:
     * one feature for the exact input coordinates and one feature for the coordinates of the network
     * node it snapped to.
     *
     * @defaultValue
     * Default false.
     */
    show_locations?: boolean
}

export interface ValhallaMatrixParams extends ValhallaRequestParams {
    sources: ValhallaLocation[]
    targets: ValhallaLocation[]
}

export interface ValhallaContours {
    /** A floating point value specifying the time in minutes for the contour. */
    time?: number
    /** A floating point value specifying the distance in kilometers for the contour. */
    distance?: number
    /**
     * The color for the output of the contour. Specify it as a Hex value, but without the #,
     * such as "color":"ff0000" for red. If no color is specified, the isochrone service will
     * assign a default color to the output.
     */
    color?: string
}

export interface ValhallaRouteResponse {
    /**
     * If specified, the input ID.
     */
    id?: string
    /**
     * The route results are returned as a trip. This is a JSON object that contains
     * details about the trip, including locations, a summary with basic information about
     * the entire trip, and a list of legs.
     */
    trip?: ValhallaTrip
    /**
     * Alternate routes, if `alternates` was set in the request.
     */
    alternates?: ValhallaRouteResponse[]
}

export interface ValhallaTrip {
    /**
     * Location information is returned in the same form as it is entered with additional fields
     * to indicate the side of the street.
     */
    locations?: ValhallaReturnLocation[]

    /**
     * A trip contains one or more legs. For n number of break locations, there are n-1 legs.
     * Through locations do not create separate legs.
     */
    legs: ValhallaLeg[]
    summary: ValhallaRouteSummary
    status_message: string
    /**
     * Status code.
     *
     * @see {@link https://valhalla.readthedocs.io/en/latest/api/turn-by-turn/api-reference/#internal-error-codes-and-conditions} for the full list of possible status codes.
     */
    status: number
    /** The specified units of length are returned, either kilometers or miles. */
    units: string
    /**
     * The language of the narration instructions. If the user specified a language in the
     * directions options and the specified language was supported - this returned value will
     * be equal to the specified value. Otherwise, this value will be the default (en-US) language.
     */
    language: string
    /**
     * This array may contain warning objects informing about deprecated request parameters, clamped values etc.
     */
    warnings?: any
}

export interface ValhallaLeg {
    /**
     * A leg summary is comprised of the same information as a trip summary but applied to the single leg of the trip.
     */
    summary: ValhallaRouteSummary
    /**
     * The shape is an encoded polyline of the route path (with 6 digits decimal precision).
     */
    shape?: string
    maneuvers?: ValhallaManeuvers[]
}

interface ValhallaManeuvers {
    type?: number
    /**
     * Written maneuver instruction. Describes the maneuver.
     *
     * @example
     *
     * "Turn right onto Main Street"
     */
    instruction?: string
    /**
     * Text suitable for use as a verbal alert in a navigation application. The transition alert
     * instruction will prepare the user for the forthcoming transition.
     *
     * @example
     * "Turn right onto North Prince Street"
     */
    verbal_transition_alert_instruction?: string
    /**
     * Text suitable for use as a verbal message immediately prior to the maneuver transition.
     *
     * @example
     * "Turn right onto North Prince Street, U.S. 2 22"
     */
    verbal_pre_transition_instruction?: string
    /**
     * Text suitable for use as a verbal message immediately after the maneuver transition.
     *
     * @example
     *
     * "Continue on U.S. 2 22 for 3.9 miles"
     */
    verbal_post_transition_instruction?: string
    /** List of street names that are consistent along the entire nonobvious maneuver. */
    street_names?: string[]
    /**
     * When present, these are the street names at the beginning (transition point) of the
     * nonobvious maneuver (if they are different than the names that are consistent along the
     * entire nonobvious maneuver).
     */
    begin_street_names?: string[]
    /** Estimated time along the maneuver in seconds. */
    time?: number
    /** Maneuver length in the units specified. */
    length?: number
    /** Index into the list of shape points for the start of the maneuver. */
    begin_shape_index?: number
    /** Index into the list of shape points for the end of the maneuver. */
    end_shape_index?: number
    /** True if the maneuver has any toll, or portions of the maneuver are subject to a toll. */
    toll?: boolean
    /** True if a highway is encountered on this maneuver. */
    highway?: boolean
    /** True if the maneuver is unpaved or rough pavement, or has any portions that have rough pavement. */
    rough?: boolean
    /** True if a gate is encountered on this maneuver. */
    gate?: boolean
    /** True if a ferry is encountered on this maneuver. */
    ferry?: boolean
    /**
     * Contains the interchange guide information at a road junction associated with this maneuver.
     *  @see {@link https://valhalla.readthedocs.io/en/latest/api/turn-by-turn/api-reference/#trip-legs-and-maneuvers} the list of maneuver types for details.
     */
    sign?: { [k: string]: string[] }
    /** The spoke to exit roundabout after entering. */
    roundabout_exit_count?: number
    /**
     * Written depart time instruction. Typically used with a transit maneuver,
     *
     * @example
     * "Depart: 8:04 AM from 8 St - NYU"
     */
    depart_instruction?: string
    /**
     * Text suitable for use as a verbal depart time instruction. Typically used with a
     * transit maneuver.
     * @example
     * "Depart at 8:04 AM from 8 St - NYU"
     */
    verbal_depart_instruction?: string
    /**
     * Written arrive time instruction. Typically used with a transit maneuver.
     * @example
     * "Arrive: 8:10 AM at 34 St - Herald Sq"
     */
    arrive_instruction?: string
    /**
     * Text suitable for use as a verbal arrive time instruction. Typically used with a transit
     * maneuver.
     * @example
     * "Arrive at 8:10 AM at 34 St - Herald Sq"
     */
    verbal_arrive_instruction?: string
    /**
     * Contains the attributes that describe a specific transit route.
     *
     *  @see {@link https://valhalla.readthedocs.io/en/latest/api/turn-by-turn/api-reference/#trip-legs-and-maneuvers} the list of maneuver types for details.
     */
    transit_info?: { [k: string]: any }
    /**
     * True if the verbal_pre_transition_instruction has been appended with the verbal
     * instruction of the next maneuver.
     */
    verbal_multi_cue?: boolean
    travel_mode?: ValhallaTravelMode
    /**
     * Travel type for drive.
     */
    travel_type?: ValhallaTravelType
    /**
     * Used when travel_mode is bikeshare. Describes bike share maneuver.
     *
     * @defaultValue
     * The default value is "NoneAction".
     */
    bss_maneuver_type?:
        | "NoneAction"
        | "RentBikeAtBikeShare"
        | "ReturnBikeAtBikeShare"
}

/**
 * In the service response, the isochrone contours are returned as GeoJSON, which can be integrated
 * into mapping applications.
 */
export interface ValhallaIsochroneResponse extends FeatureCollection {
    id?: string
}

export interface ValhallaMatrixResponse {
    sources_to_targets: ValhallaMatrixItem[][]
    sources: ValhallaReturnLocation[][]
    targets: ValhallaReturnLocation[][]
    locations?: ValhallaReturnLocation[]
    units?: string
    warnings?: { [k: string]: any }[]
}

interface ValhallaMatrixItem {
    distance?: number | null
    time?: number | null
    from_index: number
    to_index: number
}

type ValhallaTravelMode = "drive" | "pedestrian" | "bicycle" | "transit"
type ValhallaTravelType =
    /** Travel type for drive. */
    | "car"
    /** Travel type for pedestrian. */
    | "foot"
    /** Travel type for bicycle. */
    | "road"
    /** Travel type for transit.*/
    | "tram"
    | "metro"
    | "rail"
    | "bus"
    | "ferry"
    | "cable_car"
    | "gondola"
    | "funicular"

interface ValhallaRouteSummary {
    /** Estimated elapsed time to complete the trip. */
    time: number
    /** Distance traveled for the entire trip. Units are either miles or kilometers based on the input units specified. */
    length: number
    /** Flag indicating if the the path uses one or more toll segments. */
    has_toll?: boolean
    /** Flag indicating if the the path uses one or more highway segments. */
    has_highway?: boolean
    /** Flag indicating if the the path uses one or more ferry segments. */
    has_ferry?: boolean
    /** Route's bounding box */
    min_lat: number
    /** Route's bounding box */
    min_lon: number
    /** Route's bounding box */
    max_lat: number
    /** Route's bounding box */
    max_lon: number
}

export type ValhallaDirectionsType =
    /** no maneuvers or instructions should be returned,*/
    | "none"
    /** only maneuvers should be returned. */
    | "maneuvers"
    /** maneuvers with instructions should be returned */
    | "instructions"

/**
 * This is the local date and time at the location.
 */
export interface ValhallaDateTime {
    type: /** Current departure time */
    | 0
        /** Specified departure time */
        | 1
        /** Specified arrival time. Not yet implemented for multimodal costing method. */
        | 2
        /**
         * Invariant specified time. Time does not vary over the course of the path.
         * Not implemented for multimodal or bike share routing
         */
        | 3
    value: string
}

export interface ValhallaLocation {
    /**
     * Latitude of the location in degrees. This is assumed to be both the routing location and
     * the display location if no display_lat and display_lon are provided.
     */
    lat: number
    /**
     * Longitude of the location in degrees. This is assumed to be both the routing location and the
     * display location if no display_lat and display_lon are provided.
     */
    lon: number
    /**
     * Type of location, either break, through, via or break_through.
     *
     * @remarks
     *
     * Each type controls two characteristics: whether or not to allow a u-turn at the location and
     * whether or not to generate guidance/legs at the location. The types of the first and last locations are ignored and
     * are treated as breaks.
     *
     * @defaultValue
     * If no type is provided,
     * the type is assumed to be a break.
     *
     */
    type?: ValhallaLocationType
    /**
     * Preferred direction of travel for the start from the location.
     *
     * @remarks
     *
     * This can be useful for mobile
     * routing where a vehicle is traveling in a specific direction along a road, and the route should
     * start in that direction. The heading is indicated in degrees from north in a clockwise direction,
     * where north is 0°, east is 90°, south is 180°, and west is 270°.
     */
    heading?: number
    /**
     * How close in degrees a given street's angle must be in order for it to be considered as in the
     * same direction of the heading parameter.
     *
     * @defaultValue
     * The default value is 60 degrees.
     */
    heading_tolerance?: number
    /**
     * Street name. The street name may be used to assist finding the correct routing location at
     * the specified latitude, longitude.
     *
     * @remarks
     * This is not currently implemented.
     */
    street?: string
    /**
     * OpenStreetMap identification number for a polyline way. The way ID may be used to assist
     * finding the correct routing location at the specified latitude, longitude.
     *
     * @remarks
     *
     * This is not currently implemented.
     */
    way_id?: number
    /**
     * Minimum number of nodes (intersections) reachable for a given edge (road between intersections) to
     * consider that edge as belonging to a connected region.
     *
     * @remarks
     * When correlating this location to the route network, try to find candidates who are reachable
     * from this many or more nodes (intersections). If a given candidate edge reaches less than
     * this number of nodes its considered to be a disconnected island and we'll search for more
     * candidates until we find at least one that isn't considered a disconnected island. If this
     * value is larger than the configured service limit it will be clamped to that limit.
     *
     * @defaultValue
     * The default is a minimum of 50 reachable nodes.
     */
    minimum_reachability?: number
    /**
     * The number of meters about this input location within which edges (roads between intersections)
     * will be considered as candidates for said location. When correlating this location to the
     * route network, try to only return results within this distance (meters) from this location.
     * If there are no candidates within this distance it will return the closest candidate within
     * reason. If this value is larger than the configured service limit it will be clamped to that
     * limit.
     *
     * @defaultValue
     * The default is 0 meters.
     */
    radius?: number
    /**
     * Whether or not to rank the edge candidates for this location.
     *
     * @remarks
     * The ranking is used as a penalty
     * within the routing algorithm so that some edges will be penalized more heavily than others.
     * If true candidates will be ranked according to their distance from the input and various other
     * attributes. If false the candidates will all be treated as equal which should lead to routes
     * that are just the most optimal path with emphasis about which edges were selected.
     */
    rank_candidates?: boolean
    /**
     * If the location is not offset from the road centerline or is closest to an intersection this
     * option has no effect. Otherwise the determined side of street is used to determine whether
     * or not the location should be visited from the same, opposite or either side of the road with
     * respect to the side of the road the given locale drives on.
     *
     * @remarks
     *
     * In Germany (driving on the right
     * side of the road), passing a value of same will only allow you to leave from or arrive at a
     * location such that the location will be on your right. In Australia (driving on the left side
     * of the road), passing a value of same will force the location to be on your left. A value of
     * opposite will enforce arriving/departing from a location on the opposite side of the road from
     * that which you would be driving on while a value of either will make no attempt limit the side
     * of street that is available for the route.
     */
    preferred_side?: ValhallaPreferredSiteType
    /**
     * Latitude of the map location in degrees.
     *
     * @remarks
     *
     * If provided the lat and lon parameters will be treated as the routing location and the
     * display_lat and display_lon will be used to determine the side of street. Both display_lat
     * and display_lon must be provided and valid to achieve the desired effect.
     *
     */
    display_lat?: number
    /**
     * Longitude of the map location in degrees.
     *
     * @remarks
     *
     * If provided the lat and lon parameters will be treated as the routing location and the
     * display_lat and display_lon will be used to determine the side of street. Both display_lat
     * and display_lon must be provided and valid to achieve the desired effect.
     *
     */
    display_lon?: number
    /**
     * The cutoff at which we will assume the input is too far away from civilisation to be worth
     * correlating to the nearest graph elements
     */
    search_cutoff?: number
    /**
     * During edge correlation this is the tolerance used to determine whether or not to snap
     * to the intersection rather than along the street, if the snap location is within this
     * distance from the intersection the intersection is used instead.
     *
     * @defaultValue
     * The default is 5 meters.
     */
    node_snap_tolerance?: number
    /**
     * If your input coordinate is less than this tolerance away from the edge centerline then we set
     * your side of street to none otherwise your side of street will be left or right depending on
     * direction of travel.
     */
    street_side_tolerance?: number
    /**
     * The max distance in meters that the input coordinates or display ll can be from the edge
     * centerline for them to be used for determining the side of street. Beyond this distance
     * the side of street is set to none.
     */
    street_side_max_distance?: number
    /** A set of optional filters to exclude candidate edges based on their attribution. */
    search_filter?: ValhallaSearchFilter
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     */
    name?: string
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     */
    city?: string
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     */
    state?: string
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     */
    postal_code?: string
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     */
    country?: string
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     */
    phone?: string
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     */
    url?: string
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     * Response only.
     */
    side_of_street?: ValhallaSideOfStreet
    /**
     *
     * @remarks
     * This information is carried through the request and returned as a convenience.
     * Response only.
     */
    date_time?: string
}

interface ValhallaReturnLocation extends ValhallaLocation {
    original_index?: number
}
/**
 * Valhalla's routing service uses dynamic, run-time costing to generate the route path. The route
 * request must include the name of the costing model and can include optional parameters available
 * for the chosen costing model.
 */
interface ValhallaCostingOptTypes {
    auto?: ValhallaCostingOptsAuto
    truck?: ValhallaCostingOptsTruck
    bicycle?: ValhallaCostingOptsBicycle
    motorcycle?: ValhallaCostingOptsMotorcycle
    pedestrian?: ValhallaCostingOptsPedestrian
}

interface ValhallaCostingOptsBase {
    /**
     * This value indicates the willingness to take ferries. This is a range of values
     * between 0 and 1. Values near 0 attempt to avoid ferries and values near 1 will favor ferries.
     *
     * @defaultValue
     * The default value is 0.5.
     *
     * @remarks
     * Note that sometimes ferries are required to complete a route so values of 0 are not guaranteed to avoid ferries entirely.
     */
    use_ferry?: number
    /**
     * This value indicates the willingness to take living streets. This is a range of values
     * between 0 and 1. Values near 0 attempt to avoid living streets and values near 1 will
     * favor living streets.
     *
     * @defaultValue
     * The default value is 0 for trucks, 0.1 for cars, buses, motor
     * scooters and motorcycles.
     *
     * @remarks
     * Note that sometimes living streets are required to complete
     * a route so values of 0 are not guaranteed to avoid living streets entirely.
     */
    use_living_streets?: number
    /**
     * A penalty applied for transition to generic service road. The default penalty is 0 for
     * trucks and 15 for cars, buses, motor scooters and motorcycles.
     */
    service_penalty?: number
    /**
     * Changes the metric to quasi-shortest, i.e. purely distance-based costing.
     *
     * @remarks
     *
     * Note, this will disable all other costings & penalties. Also note, shortest will not
     * disable hierarchy pruning, leading to potentially sub-optimal routes for some costing
     * models.
     *
     * @defaultValue
     * The default is false.
     */
    shortest?: boolean
}

interface ValhallaCostingOptsWheels extends ValhallaCostingOptsBase {
    maneuver_penalty?: number
    gate_cost?: number
    gate_penalty?: number
    /**
     * A cost applied when encountering an international border. This cost is added to the
     * estimated and elapsed times.
     *
     * @defaultValue
     * The default cost is 600 seconds.
     */
    country_crossing_cost?: number
    /**
     * A penalty applied for a country crossing. This penalty can be used to create paths that
     * avoid spanning country boundaries.
     *
     * @defaultValue
     * The default penalty is 0.
     */
    country_crossing_penalty?: number
}

export interface ValhallaCostingOptsPedestrian extends ValhallaCostingOptsBase {
    /**
     * Walking speed in kilometers per hour. Must be between 0.5 and 25 km/hr.
     *
     * @defaultValue
     * Defaults to 5.1 km/hr (3.1 miles/hour).
     */
    walking_speed?: number
    /**
     * A factor that modifies the cost when encountering roads classified as footway (no motorized
     * vehicles allowed), which may be designated footpaths or designated sidewalks along residential
     * roads. Pedestrian routes generally attempt to favor using these walkways and sidewalks.
     *
     * @defaultValue
     * The default walkway_factor is 1.0.
     */
    walkway_factor?: number
    /**
     * A factor that modifies the cost when encountering roads with dedicated sidewalks. Pedestrian
     * routes generally attempt to favor using sidewalks.
     *
     * @defaultValue
     * The default sidewalk_factor is 1.0.
     */
    sidewalk_factor?: number
    /**
     * A factor that modifies (multiplies) the cost when alleys are encountered. Pedestrian routes
     * generally want to avoid alleys or narrow service roads between buildings.
     *
     * @defaultValue
     * The default alley_factor is 2.0.
     */
    alley_factor?: number
    /**
     * A factor that modifies (multiplies) the cost when encountering a driveway, which is often a
     * private, service road. Pedestrian routes generally want to avoid driveways (private).
     *
     * @defaultValue
     * The default driveway factor is 5.0.
     */
    driveway_factor?: number
    /**
     * A penalty in seconds added to each transition onto a path with steps or stairs. Higher values
     * apply larger cost penalties to avoid paths that contain flights of steps.
     */
    step_penalty?: number
    /**
     * This value indicates the willingness to take track roads. This is a range of values between
     * 0 and 1. Values near 0 attempt to avoid tracks and values near 1 will favor tracks a
     * little bit.
     *
     * @defaultValue
     * The default value is 0.5. Note that sometimes tracks are required to complete a route so values of 0 are not guaranteed to avoid tracks entirely.
     */
    use_tracks?: number
    /**
     * This is a range of values from 0 to 1, where 0 attempts to avoid hills and steep grades even if
     * it means a longer (time and distance) path, while 1 indicates the pedestrian does not fear
     * hills and steeper grades. Based on the use_hills factor, penalties are applied to roads based
     * on elevation change and grade. These penalties help the path avoid hilly roads in favor of flatter roads or less steep grades where available. Note that it is not always possible to find alternate paths to avoid hills (for example when route locations are in mountainous areas). The default value is 0.5.
     */
    use_hills?: number
    /**
     * A penalty applied for transition to generic service road.
     *
     * @defaultValue
     * The default penalty is 0.
     */
    service_penalty?: number
    /**
     * A factor that modifies (multiplies) the cost when generic service roads are encountered.
     *
     * @defaultValue
     * The default service_factor is 1.
     */
    service_factor?: number
    /**
     * This value indicates the maximum difficulty of hiking trails that is allowed. Values between 0
     * and 6 are allowed.
     *
     * @see {@link https://wiki.openstreetmap.org/wiki/Key:sac_scale} the corresponding sac_scale values within OpenStreetMap.
     *
     * @defaultValue
     * The default value is 1 which means that well cleared trails that are mostly flat or slightly sloped are allowed. Higher difficulty trails can be allowed by specifying a higher value for max_hiking_difficulty.
     */
    max_hiking_difficulty?: number
    /**
     * This value is useful when bikeshare is chosen as travel mode. It is meant to give the time will
     * be used to rent a bike from a bike share station. This value will be displayed in the final
     * directions and used to calculate the whole duation.
     *
     * @defaultValue
     * The default value is 120 seconds.
     */
    bss_rent_cost?: number
    /**
     * This value is useful when bikeshare is chosen as travel mode. It is meant to describe
     * the potential effort to rent a bike from a bike share station. This value won't be
     * displayed and used only inside of the algorithm.
     */
    bss_rent_penalty?: number
}

export interface ValhallaCostingOptsAuto extends ValhallaCostingOptsWheels {
    /**
     * A penalty applied when transitioning between roads that do not have consistent
     * naming–in other words, no road names in common. This penalty can be used to create
     * simpler routes that tend to have fewer maneuvers or narrative guidance instructions.
     *
     * @defaultValue
     * The default maneuver penalty is five seconds.
     */
    private_access_penalty?: number
    /**
     * A cost applied when a toll booth is encountered. This cost is added to the estimated and
     * elapsed times.
     *
     * @defaultValue
     * The default cost is 15 seconds.
     */
    toll_booth_cost?: number
    /**
     * A penalty applied to the cost when a toll booth is encountered. This penalty can be used to
     * create paths that avoid toll roads.
     *
     * @defaultValue
     *  The default toll booth penalty is 0.
     */
    toll_booth_penalty?: number
    /**
     * A cost applied when entering a ferry. This cost is added to the estimated and elapsed times.
     *
     * @defaultValue
     * The default cost is 300 seconds (5 minutes).
     */
    ferry_cost?: number
    /**
     * This value indicates the willingness to take highways. This is a range of values between 0
     * and 1. Values near 0 attempt to avoid highways and values near 1 will favor highways.
     *
     * @defaultValue
     * The default value is 1.0.
     *
     * @remarks
     * Note that sometimes highways are required to complete a route so
     * values of 0 are not guaranteed to avoid highways entirely.
     */
    use_highways?: number
    /**
     * This value indicates the willingness to take roads with tolls. This is a range of values
     * between 0 and 1. Values near 0 attempt to avoid tolls and values near 1 will not attempt
     * to avoid them.
     *
     * @defaultValue
     * The default value is 0.5.
     *
     * @remarks
     * Note that sometimes roads with tolls are
     * required to complete a route so values of 0 are not guaranteed to avoid them entirely.
     */
    use_tolls?: number
    /**
     * This value indicates the willingness to take track roads. This is a range of values between
     * 0 and 1. Values near 0 attempt to avoid tracks and values near 1 will favor tracks a
     * little bit.
     *
     * @defaultValue
     * The default value is 0 for autos, 0.5 for motor scooters and motorcycles.
     *
     * @remarks
     *
     * Note that sometimes tracks are required to complete a route so values of 0 are
     * not guaranteed to avoid tracks entirely.
     */
    use_tracks?: number
    /**
     * A factor that modifies (multiplies) the cost when generic service roads are encountered.
     *
     * @defaultValue
     * The default service_factor is 1.
     */
    service_factor?: number
    /**
     * Top speed the vehicle can go. Also used to avoid roads with higher speeds than this
     * value. top_speed must be between 10 and 252 KPH.
     *
     * @defaultValue
     * The default value is 140 KPH.
     */
    top_speed?: number
    /**
     * Fixed speed the vehicle can go. Used to override the calculated speed. Can be useful if
     * speed of vehicle is known. fixed_speed must be between 1 and 252 KPH.
     *
     * @defaultValue
     * The default value is 0 KPH which disables fixed speed and falls back to the standard
     * calculated speed based on the road attribution.
     */
    fixed_speed?: number
    /**
     * If set to true, ignores all closures, marked due to live traffic closures,
     * during routing.
     *
     * @remarks
     *
     * Note: This option cannot be set if location.search_filter.exclude_closures is also
     * specified in the request and will return an error if it is.
     */
    ignore_closures?: number
    /**
     * A factor that penalizes the cost when traversing a closed edge (eg: if
     * search_filter.exclude_closures is false for origin and/or destination location and the
     * route starts/ends on closed edges). Its value can range from 1.0 - don't penalize closed
     * edges, to 10.0 - apply high cost penalty to closed edges.
     *
     * @defaultValue
     * Default value is 9.0.
     *
     * @remarks
     * Note: This factor is applicable only for motorized modes of transport, i.e auto, motorcycle,
     * motor_scooter, bus, truck & taxi
     */
    closure_factor?: number
    /**
     * The height of the vehicle (in meters).
     *
     * @defaultValue
     * Default 1.9 for car, bus, taxi and 4.11 for truck.
     */
    height?: number
    /**
     * The width of the vehicle (in meters).
     *
     * @defaultValue
     * Default 1.6 for car, bus, taxi and 2.6 for truck.
     */
    width?: number
    /**
     * This value indicates whether or not the path may include unpaved roads. If exclude_unpaved
     * is set to 1 it is allowed to start and end with unpaved roads, but is not allowed to
     * have them in the middle of the route path, otherwise they are allowed.
     *
     * @defaultValue
     * Default false.
     */
    exclude_unpaved?: boolean | 1
    /**
     * A boolean value which indicates the desire to avoid routes with cash-only tolls.
     *
     * @defaultValue
     * Default false.
     */
    exclude_cash_only_tolls?: boolean
    /**
     * A boolean value which indicates the desire to include HOV roads with a 2-occupant requirement
     * in the route when advantageous.
     *
     * @defaultValue
     * Default false.
     */
    include_hov2?: boolean
    /**
     * A boolean value which indicates the desire to include HOV roads with a 3-occupant requirement
     * in the route when advantageous.
     *
     * @defaultValue
     * Default false.
     */
    include_hov3?: boolean
    /**
     * A boolean value which indicates the desire to include tolled HOV roads which require the driver
     * to pay a toll if the occupant requirement isn't met.
     *
     * @defaultValue
     * Default false.
     */
    include_hot?: boolean
}

export interface ValhallaCostingOptsTruck extends ValhallaCostingOptsAuto {
    /**
     * The length of the truck (in meters).
     *
     * @defaultValue
     * Default 21.64.
     */
    length?: number
    /**
     * The weight of the truck (in metric tons).
     *
     * @defaultValue
     * Default 21.77.
     */
    weight?: number
    /**
     * The axle load of the truck (in metric tons).
     *
     * @defaultValue
     * Default 9.07.
     */
    axle_load?: number
    /**
     * The axle count of the truck.
     *
     * @defaultValue
     * Default 5.
     */
    axle_count?: number
    /**
     * A value indicating if the truck is carrying hazardous materials.
     *
     * @defaultValue
     * Default false.
     */
    hazmat?: boolean
}

export interface ValhallaCostingOptsBicycle extends ValhallaCostingOptsWheels {
    /**
     * The type of bicycle.
     *
     * @defaultValue
     * The default type is Hybrid.
     */
    bicycle_type?: ValhallaBicycleType
    /**
     * Cycling speed is the average travel speed along smooth, flat roads. This is meant to be the
     * speed a rider can comfortably maintain over the desired distance of the route.
     *
     * @remarks
     * It can be modified (in the costing method) by surface type in conjunction with bicycle type
     * and (coming soon) by hilliness of the road section. When no speed is specifically provided,
     * the default speed is determined by the bicycle type and are as follows:
     * Road = 25 KPH (15.5 MPH), Cross = 20 KPH (13 MPH), Hybrid/City = 18 KPH (11.5 MPH), and
     * Mountain = 16 KPH (10 MPH).
     */
    cycling_speed?: number
    /**
     * A cyclist's propensity to use roads alongside other vehicles. This is a range of values
     * from 0 to 1, where 0 attempts to avoid roads and stay on cycleways and paths, and 1 indicates
     * the rider is more comfortable riding on roads.
     *
     * @remarks
     * Based on the use_roads factor, roads with
     * certain classifications and higher speeds are penalized in an attempt to avoid them when
     * finding the best path.
     *
     * @defaultValue
     * The default value is 0.5.
     */
    use_roads?: number
    /**
     * A cyclist's desire to tackle hills in their routes. This is a range of values from 0 to 1,
     * where 0 attempts to avoid hills and steep grades even if it means a longer (time and distance)
     * path, while 1 indicates the rider does not fear hills and steeper grades. Based on the
     * use_hills factor, penalties are applied to roads based on elevation change and grade. These
     * penalties help the path avoid hilly roads in favor of flatter roads or less steep grades where
     * available. Note that it is not always possible to find alternate paths to avoid
     * hills (for example when route locations are in mountainous areas).
     *
     * @defaultValue
     * The default value is 0.5.
     */
    use_hills?: number
    /**
     * This value is meant to represent how much a cyclist wants to avoid roads with poor surfaces
     * relative to the bicycle type being used. This is a range of values between 0 and 1. When the
     * value is 0, there is no penalization of roads with different surface types; only bicycle speed
     * on each surface is taken into account. As the value approaches 1, roads with poor surfaces for
     * the bike are penalized heavier so that they are only taken if they significantly
     * improve travel time. When the value is equal to 1, all bad surfaces are completely disallowed
     * from routing, including start and end points.
     *
     * @defaultValue
     * The default value is 0.25.
     */
    avoid_bad_surfaces?: number
    /**
     * This value is useful when bikeshare is chosen as travel mode. It is meant to give the time
     * will be used to return a rental bike. This value will be displayed in the final directions
     * and used to calculate the whole duation.
     *
     * @defaultValue
     * The default value is 120 seconds.
     */
    bss_return_cost?: number
    /**
     * This value is useful when bikeshare is chosen as travel mode. It is meant to describe the
     * potential effort to return a rental bike. This value won't be displayed and used only
     * inside of the algorithm.
     */
    bss_return_penalty?: number
}

export interface ValhallaCostingOptsMotorcycle extends ValhallaCostingOptsAuto {
    /**
     * A riders's desire for adventure in their routes. This is a range of values from 0 to 1,
     * where 0 will avoid trails, tracks, unclassified or bad surfaces and values towards 1 will
     * tend to avoid major roads and route on secondary roads.
     *
     * @defaultValue
     * The default value is 0.0.
     */
    use_trails?: boolean
}

type ValhallaBicycleType =
    /** a road-style bicycle with narrow tires that is generally lightweight and designed for speed on paved surfaces.  */
    | "Road"
    /** a bicycle made mostly for city riding or casual riding on roads and paths with good surfaces. */
    | "Hybrid"
    /** a bicycle made mostly for city riding or casual riding on roads and paths with good surfaces. */
    | "City"
    /** a cyclo-cross bicycle, which is similar to a road bicycle but with wider tires suitable to rougher surfaces. */
    | "Cross"
    /** a mountain bicycle suitable for most surfaces but generally heavier and slower on paved surfaces. */
    | "Mountain"

type ValhallaLocationType =
    /**
     * A break is a location at which we
     * allows u-turns and generate legs and arrival/departure maneuvers.
     * A break_through location is a location at which we do not
     * allow u-turns but do generate legs and arrival/departure maneuvers.
     */
    | "break"
    /**
     * A through location is a
     * location at which we neither allow u-turns nor generate legs or arrival/departure maneuvers.
     */
    | "through"
    /**
     * A via location is a location at which we allow u-turns but do not generate legs or
     * arrival/departure maneuvers.
     */
    | "via"
    /**
     * A break_through location is a location at which we do not
     * allow u-turns but do generate legs and arrival/departure maneuvers.
     */
    | "break_through"

type ValhallaPreferredSiteType = "same" | "opposite" | "either"

interface ValhallaSearchFilter {
    /**
     * whether to exclude roads marked as tunnels
     *
     * @defaultValue
     * Defaults to false.
     */
    exclude_tunnel?: boolean
    /**
     * whether to exclude roads marked as bridges
     *
     * @defaultValue
     * Defaults to false.
     */
    exclude_bridge?: boolean
    /**
     * whether to exclude link roads marked as ramps, note that some turn channels are
     * also marked as ramps
     *
     * @defaultValue
     * Defaults to false.
     */
    exclude_ramp?: boolean
    /**
     *  whether to exclude roads considered closed due to live traffic closure.
     *
     * @remarks
     * This option cannot be set if costing_options.<costing>.ignore_closures is also specified. An
     * error is returned if both options are specified.
     *
     * Ignoring closures at destination and source locations does NOT work for date_time type
     * 0/1 & 2 respectively
     *
     * @defaultValue
     * Defaults to true.
     */
    exclude_closures?: boolean
    /**
     * lowest road class allowed
     *
     * @remarks
     *
     * Road classes from highest to lowest are: motorway, trunk, primary, secondary, tertiary,
     * unclassified, residential, service_other.
     *
     * @defaultValue
     * Defaults to `service_other`
     */
    min_road_class?: string
    /**
     * highest road class allowed
     *
     * @remarks
     *
     * Road classes from highest to lowest are: motorway, trunk, primary, secondary, tertiary,
     * unclassified, residential, service_other.
     *
     *
     * @defaultValue
     * Defaults to `motorway`
     */
    max_road_class?: string
}

/**
 * The side of street of a break location that is determined based on the actual route when the
 * location is offset from the street.
 */
type ValhallaSideOfStreet = "left" | "right"

/**
 * Valhalla's routing service uses dynamic, run-time costing to generate the route path. The route
 * request must include the name of the costing model and can include optional parameters available
 * for the chosen costing model.
 */
export type ValhallaCostingType =
    /**
     * Standard costing for driving routes by car, motorcycle, truck, and so on that obeys
     * automobile driving rules, such as access and turn restrictions. Auto provides a short time
     * path (though not guaranteed to be shortest time) and uses intersection costing to minimize
     * turns and maneuvers or road name changes. Routes also tend to favor highways and higher
     * classification roads, such as motorways and trunks.
     */
    | "auto"
    /**
     * Standard costing for travel by bicycle, with a slight preference for using cycleways or
     * roads with bicycle lanes. Bicycle routes follow regular roads when needed, but avoid roads
     * without bicycle access.
     */
    | "bicycle"
    /**
     * Standard costing for travel by motorcycle. This costing model provides options to tune the
     * route to take roadways (road touring) vs. tracks and trails (adventure motorcycling).
     */
    | "motorcycle"
    /**
     * Standard costing for trucks. Truck costing inherits the auto costing behaviors, but checks
     * for truck access, width and height restrictions, and weight limits on the roads.
     */
    | "truck"
    /**
     * Standard walking route that excludes roads without pedestrian access. In general, pedestrian
     * routes are shortest distance with the following exceptions: walkways and footpaths are slightly
     * favored, while steps or stairs and alleys are slightly avoided.
     */
    | "pedestrian"

export interface MapboxAuthParams {
    access_token?: string // TODO: needs to be abstracted to work with mb/OSRM
}
