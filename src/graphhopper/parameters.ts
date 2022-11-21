import { Feature, LineString, Polygon } from "geojson"

interface GraphHopperBaseParams {
    profile: GraphHopperProfile
}

export interface GraphHopperRouteParams extends GraphHopperBaseParams {
    points: [number, number][]
    point_hints?: string[]
    snap_preventions?: string[]
    curbsides?: GraphHopperCurbside[]
    locale?: string
    elevation?: boolean
    details?: GraphHopperDetail[]
    optimize?: boolean
    instructions?: boolean
    calc_points?: boolean
    debug?: boolean
    points_encoded?: boolean
    "ch.disable"?: boolean
    custom_model?: GraphHopperCustomModel
    headings?: number[]
    heading_penalty?: number
    pass_through?: boolean
    algorithm?: GraphHopperAlgorithm
    "round_trip.distance"?: number
    "round_trip.seed"?: number
    "alternative_route.max_paths"?: number
    "alternative_route.max_weight_factor"?: number
    "alternative_route.max_share_factor"?: number
}

export interface GraphHopperIsochroneParams extends GraphHopperBaseParams {
    point: [number, number]
    time_limit?: number
    distance_limit?: number
    buckets?: number
    reverse_flow?: boolean
}

export interface GraphHopperIsochroneGetParams {
    point: string
    profile: string
    distance_limit?: string
    time_limit?: string
    buckets?: string
    reverse_flow?: string
}

export interface GraphHopperMatrixParams extends GraphHopperBaseParams {
    from_points: [number, number][]
    to_points: [number, number][]
    from_point_hints?: string[]
    to_point_hints?: string[]
    snap_preventions?: string[]
    from_curbsides?: GraphHopperCurbside[]
    to_curbsides?: GraphHopperCurbside[]
    out_arrays?: GraphHopperMatrixOut[]
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

type GraphHopperAlgorithm = "round_trip" | "alternative_route"
export interface GraphHopperRoutePath {
    distance: number
    time: number
    ascend: number
    descend: number
    points: LineString | string
    snapped_waypoints: LineString | string
    points_encoded: boolean
    bbox: [number, number, number, number]
    instructions: GraphHopperInstruction[]
    details: { [Property in keyof GraphHopperDetail]: any }
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
