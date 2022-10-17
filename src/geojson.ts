export interface FeatureCollection {
    features: Feature[]
}

interface Feature {
    type: "Feature"
    id?: string | number
    properties: JSONObject
    geometry: Geometry
}

export interface Geometry {
    type: GeometryType
    coordinates: NestedArray<number>
    crs?: JSONObject
}

type GeometryType =
    | "Point"
    | "LineString"
    | "Polygon"
    | "MultiPoint"
    | "MultiLineString"
    | "MultiPolygon"

type JSONValue = number | string | boolean | null | JSONArray | JSONObject
type JSONArray = JSONValue[]
type JSONObject = { [k: string]: JSONValue }
interface NestedArray<T> extends Array<T | NestedArray<T>> {}
