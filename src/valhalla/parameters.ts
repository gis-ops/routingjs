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
    exclude_locations?: [number, number][]
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
    locations: ValhallaLocation[]
    date_time?: ValhallaDateTime
    contours: ValhallaContours[]
    polygons?: boolean
    denoise?: number
    generalize?: number
    show_locations?: boolean
}

export interface ValhallaMatrixParams extends ValhallaRequestParams {
    sources: ValhallaLocation[]
    targets: ValhallaLocation[]
}

export interface ValhallaContours {
    time?: number
    distance?: number
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
    summary: ValhallaRouteSummary
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
    heading?: number
    heading_tolerance?: number
    street?: string
    way_id?: number
    minimum_reachability?: number
    radius?: number
    rank_candidates?: boolean
    preferred_side?: ValhallaPreferredSiteType
    display_lat?: number
    display_lon?: number
    search_cutoff?: number
    node_snap_tolerance?: number
    street_side_tolerance?: number
    street_side_max_distance?: number
    search_filter?: ValhallaSearchFilter
    min_road_class?: string
    max_road_class?: string
    name?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
    phone?: string
    url?: string
    side_of_street?: ValhallaSideOfStreet
    date_time?: string
}

interface ValhallaReturnLocation extends ValhallaLocation {
    original_index?: number
}

interface ValhallaCostingOptTypes {
    auto?: ValhallaCostingOptsAuto
    truck?: ValhallaCostingOptsTruck
    bicycle?: ValhallaCostingOptsBicycle
    motorcycle?: ValhallaCostingOptsMotorcycle
    pedestrian?: ValhallaCostingOptsPedestrian
}

interface ValhallaCostingOptsBase {
    use_ferry?: number
    use_living_streets?: number
    service_penalty?: number
    shortest?: boolean
}

interface ValhallaCostingOptsWheels extends ValhallaCostingOptsBase {
    maneuver_penalty?: number
    gate_cost?: number
    gate_penalty?: number
    country_crossing_cost?: number
    country_crossing_penalty?: number
}

export interface ValhallaCostingOptsPedestrian extends ValhallaCostingOptsBase {
    walking_speed?: number
    walkway_factor?: number
    sidewalk_factor?: number
    alley_factor?: number
    driveway_factor?: number
    step_penalty?: number
    use_tracks?: number
    use_hills?: number
    service_factor?: number
    max_hiking_difficulty?: number
    bss_rent_cost?: number
    bss_rent_penalty?: number
}

export interface ValhallaCostingOptsAuto extends ValhallaCostingOptsWheels {
    private_access_penalty?: number
    toll_booth_cost?: number
    toll_booth_penalty?: number
    ferry_cost?: number
    use_highways?: number
    use_tolls?: number
    use_tracks?: number
    service_factor?: number
    top_speed?: number
    fixed_speed?: number
    ignore_closures?: number
    closure_factor?: number
    height?: number
    width?: number
    exclude_unpaved?: boolean | 1
    exclude_cash_only_tolls?: boolean
    include_hov2?: boolean
    include_hov3?: boolean
    include_hot?: boolean
}

export interface ValhallaCostingOptsTruck extends ValhallaCostingOptsAuto {
    length?: number
    weight?: number
    axle_load?: number
    hazmat?: boolean
}

export interface ValhallaCostingOptsBicycle extends ValhallaCostingOptsWheels {
    bicycle_type?: ValhallaBicycleType
    cycling_speed?: number
    use_roads?: number
    use_hills?: number
    avoid_bad_surfaces?: number
    bss_return_cost?: number
    bss_return_penalty?: number
}

export interface ValhallaCostingOptsMotorcycle extends ValhallaCostingOptsAuto {
    use_trails?: boolean
}

type ValhallaBicycleType = "Road" | "Hybrid" | "City" | "Cross" | "Mountain"
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
    exclude_tunnel?: boolean
    exclude_bridge?: boolean
    exclude_ramp?: boolean
    exclude_closures?: boolean
}

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
    access_token: string // TODO: needs to be abstracted to work with mb/OSRM
}
