export type JSONValue = string | number | boolean | JSONArray | JSONObject
export type JSONArray = JSONValue[]
export interface JSONObject {
    [k: number | string]: JSONValue
}
