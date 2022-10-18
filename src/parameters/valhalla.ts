export interface ValhallaRouteParams extends ValhallaRequestParams {
    locations: ValhallaLocation[]
    narrative?: boolean
    directions_options?: ValhallaDirectionsOptions
    alternates?: number
    exclude_locations?: [number, number][]
    exclude_polygons?: [number, number][][] | [number, number][][][]
    date_time?: ValhallaDateTime
    linear_references?: boolean
}

interface ValhallaDirectionsOptions {
    units?: ValhallaRequestUnit
    directions_type?: ValhallaDirectionsType
    language?: string
}

interface ValhallaRequestParams {
    costing: ValhallaCostingType
    costing_options?: ValhallaCostingOptTypes
    id?: string
}

export type ValhallaRequestUnit = "mi" | "km" | "miles" | "kilometers"

export interface ValhallaIsochroneParams extends ValhallaRequestParams {
    locations: [ValhallaLocation]
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

interface ValhallaContours {
    time?: number
    distance?: number
    color?: string
}

export interface ValhallaRouteResponse {
    id?: string
    trip?: ValhallaTrip
    alternates?: ValhallaRouteResponse[]
}

export interface ValhallaTrip {
    locations?: ValhallaReturnLocation[]
    legs?: ValhallaLeg[]
    summary?: ValhallaRouteSummary
    status_message?: string
    status?: number
    units?: string
    language?: string
    warnings?: any
}

export interface ValhallaLeg {
    summary: ValhallaRouteSummary
    shape?: string
    maneuvers?: ValhallaManeuvers[]
}

interface ValhallaManeuvers {
    type?: number
    instruction?: string
    verbal_transition_alert_instruction?: string
    verbal_pre_transition_instruction?: string
    verbal_post_transition_instruction?: string
    street_names?: string[]
    begin_street_names?: string[]
    time?: number
    length?: number
    begin_shape_index?: number
    end_shape_index?: number
    toll?: boolean
    rough?: boolean
    gate?: boolean
    ferry?: boolean
    sign?: { [k: string]: string[] }
    roundabout_exit_count?: number
    depart_instruction?: string
    verbal_depart_instruction?: string
    arrive_instruction?: string
    verbal_arrive_instruction?: string
    transit_info?: { [k: string]: any }
    verbal_multi_cue?: boolean
    travel_mode?: ValhallaTravelMode
    travel_type?: ValhallaTravelType
    bss_maneuver_type?:
        | "NoneAction"
        | "RentBikeAtBikeShare"
        | "ReturnBikeAtBikeShare"
}

export interface ValhallaMatrixResponse {
    sources_to_targets?: ValhallaMatrixItem[][]
    sources?: ValhallaReturnLocation[][]
    targets?: ValhallaReturnLocation[][]
    locations?: ValhallaReturnLocation[]
    units?: string
    warnings?: { [k: string]: any }[]
}

interface ValhallaMatrixItem {
    distance: number
    time: number
    from_index: number
    to_index: number
}

type ValhallaTravelMode = "drive" | "pedestrian" | "bicycle" | "transit"
type ValhallaTravelType =
    | "car"
    | "foot"
    | "road"
    | "tram"
    | "metro"
    | "rail"
    | "bus"
    | "ferry"
    | "cable_car"
    | "gondola"
    | "funicular"

interface ValhallaRouteSummary {
    time: number
    length: number
    min_lat: number
    min_lon: number
    max_lat: number
    max_lon: number
}

export type ValhallaDirectionsType = "none" | "maneuvers" | "instructions"

export interface ValhallaDateTime {
    type: 0 | 1 | 2 | 3
    value: string
}

export interface ValhallaLocation {
    lat: number
    lon: number
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
type ValhallaLocationType = "break" | "through" | "via" | "break_through"

type ValhallaPreferredSiteType = "same" | "opposite" | "either"

interface ValhallaSearchFilter {
    exclude_tunnel?: boolean
    exclude_bridge?: boolean
    exclude_ramp?: boolean
    exclude_closures?: boolean
}

type ValhallaSideOfStreet = "left" | "right"

export type ValhallaCostingType =
    | "auto"
    | "bicycle"
    | "motorcycle"
    | "truck"
    | "pedestrian"

export interface MapboxAuthParams {
    access_token: string
}
