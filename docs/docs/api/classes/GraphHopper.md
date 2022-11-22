---
id: "GraphHopper"
title: "Class: GraphHopper"
sidebar_label: "GraphHopper"
sidebar_position: 0
custom_edit_url: null
---

Performs requests to the  GraphHopper API.

For the full documentation, see  [https://docs.graphhopper.com](https://docs.graphhopper.com).

## Implements

- `BaseRouter`

## Constructors

### constructor

• **new GraphHopper**(`graphHopperClientArgs`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `graphHopperClientArgs` | `GraphHopperClientArgs` |

#### Defined in

[graphhopper/index.ts:95](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L95)

## Properties

### apiKey

• `Optional` **apiKey**: `string`

#### Defined in

[graphhopper/index.ts:93](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L93)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[graphhopper/index.ts:92](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L92)

## Methods

### directions

▸ **directions**(`locations`, `profile`, `directionsOpts?`, `dryRun?`): `Promise`<`Directions`<`GraphHopperRouteResponse`\>\>

Get directions between two or more points. For the complete documentation, please see [https://docs.graphhopper.com/#operation/postRoute](https://docs.graphhopper.com/#operation/postRoute).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locations` | [`number`, `number`][] | coordinate tuples in lat/lon format |
| `profile` | `GraphHopperProfile` | one of GraphHopperProfile |
| `directionsOpts?` | [`GraphHopperDirectionsOpts`](../modules.md#graphhopperdirectionsopts) | optional parameters that are passed to the route endpoint. See [GraphHopperDirectionsOpts](../modules.md#graphhopperdirectionsopts) |
| `dryRun?` | ``false`` | if true, the request will not be made and a request info string is returned instead |

#### Returns

`Promise`<`Directions`<`GraphHopperRouteResponse`\>\>

#### Implementation of

BaseRouter.directions

#### Defined in

[graphhopper/index.ts:131](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L131)

▸ **directions**(`locations`, `profile`, `directionsOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `GraphHopperProfile` |
| `directionsOpts` | [`GraphHopperDirectionsOpts`](../modules.md#graphhopperdirectionsopts) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.directions

#### Defined in

[graphhopper/index.ts:137](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L137)

___

### isochrones

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts?`, `dryRun?`): `Promise`<`Isochrones`<`GraphHopperIsochroneResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `GraphHopperProfile` |
| `intervals` | [`number`] |
| `isochronesOpts?` | `GraphHopperIsochroneOpts` |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Isochrones`<`GraphHopperIsochroneResponse`\>\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[graphhopper/index.ts:205](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L205)

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `GraphHopperProfile` |
| `intervals` | [`number`] |
| `isochronesOpts` | `GraphHopperIsochroneOpts` |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[graphhopper/index.ts:212](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L212)

___

### matrix

▸ **matrix**(`locations`, `profile`, `matrixOpts?`, `dryRun?`): `Promise`<`Matrix`<`GraphHopperMatrixResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `GraphHopperProfile` |
| `matrixOpts?` | `GraphHopperMatrixOpts` |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Matrix`<`GraphHopperMatrixResponse`\>\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[graphhopper/index.ts:283](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L283)

▸ **matrix**(`locations`, `profile`, `matrixOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `GraphHopperProfile` |
| `matrixOpts` | `GraphHopperMatrixOpts` |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[graphhopper/index.ts:289](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L289)

___

### parseDirectionsResponse

▸ `Static` **parseDirectionsResponse**(`response`): `Directions`<`GraphHopperRouteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `GraphHopperRouteResponse` |

#### Returns

`Directions`<`GraphHopperRouteResponse`\>

#### Defined in

[graphhopper/index.ts:172](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L172)

___

### parseIsochroneResponse

▸ `Static` **parseIsochroneResponse**(`response`, `center`, `intervalType`): `Isochrones`<`GraphHopperIsochroneResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `GraphHopperIsochroneResponse` |
| `center` | [`number`, `number`] |
| `intervalType` | ``"time"`` \| ``"distance"`` |

#### Returns

`Isochrones`<`GraphHopperIsochroneResponse`\>

#### Defined in

[graphhopper/index.ts:265](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L265)

___

### parseMatrixResponse

▸ `Static` **parseMatrixResponse**(`response`): `Matrix`<`GraphHopperMatrixResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `GraphHopperMatrixResponse` |

#### Returns

`Matrix`<`GraphHopperMatrixResponse`\>

#### Defined in

[graphhopper/index.ts:338](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/graphhopper/index.ts#L338)
