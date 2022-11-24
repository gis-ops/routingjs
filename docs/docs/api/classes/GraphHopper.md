---
id: "GraphHopper"
title: "Class: GraphHopper"
sidebar_label: "GraphHopper"
sidebar_position: 0
custom_edit_url: null
---

Performs requests to the  GraphHopper API. Default public URL is
https://api.openrouteservice.org.

For the full documentation, see  [https://docs.graphhopper.com](https://docs.graphhopper.com).

## Implements

- `BaseRouter`

## Constructors

### constructor

• **new GraphHopper**(`clientArgs`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientArgs` | `ClientConstructorArgs` |

#### Defined in

[src/graphhopper/index.ts:52](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L52)

## Properties

### apiKey

• `Optional` **apiKey**: `string`

#### Defined in

[src/graphhopper/index.ts:50](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L50)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[src/graphhopper/index.ts:49](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L49)

## Methods

### directions

▸ **directions**(`locations`, `profile`, `directionsOpts?`, `dryRun?`): `Promise`<`Directions`<[`GraphHopperRouteResponse`](../interfaces/GraphHopperRouteResponse.md)\>\>

Get directions between two or more points. For the complete documentation, please see [https://docs.graphhopper.com/#operation/postRoute](https://docs.graphhopper.com/#operation/postRoute).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locations` | [`number`, `number`][] | coordinate tuples in lat/lon format |
| `profile` | [`GraphHopperProfile`](../modules.md#graphhopperprofile) | one of [GraphHopperProfile](../modules.md#graphhopperprofile) |
| `directionsOpts?` | [`GraphHopperDirectionsOpts`](../modules.md#graphhopperdirectionsopts) | optional parameters that are passed to the route endpoint. See [GraphHopperDirectionsOpts](../modules.md#graphhopperdirectionsopts) |
| `dryRun?` | ``false`` | if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging |

#### Returns

`Promise`<`Directions`<[`GraphHopperRouteResponse`](../interfaces/GraphHopperRouteResponse.md)\>\>

#### Implementation of

BaseRouter.directions

#### Defined in

[src/graphhopper/index.ts:90](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L90)

▸ **directions**(`locations`, `profile`, `directionsOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`GraphHopperProfile`](../modules.md#graphhopperprofile) |
| `directionsOpts` | [`GraphHopperDirectionsOpts`](../modules.md#graphhopperdirectionsopts) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.directions

#### Defined in

[src/graphhopper/index.ts:96](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L96)

___

### isochrones

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts?`, `dryRun?`): `Promise`<`Isochrones`<[`GraphHopperIsochroneResponse`](../interfaces/GraphHopperIsochroneResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | [`GraphHopperProfile`](../modules.md#graphhopperprofile) |
| `intervals` | [`number`] |
| `isochronesOpts?` | [`GraphHopperIsochroneOpts`](../interfaces/GraphHopperIsochroneOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Isochrones`<[`GraphHopperIsochroneResponse`](../interfaces/GraphHopperIsochroneResponse.md)\>\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[src/graphhopper/index.ts:164](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L164)

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | [`GraphHopperProfile`](../modules.md#graphhopperprofile) |
| `intervals` | [`number`] |
| `isochronesOpts` | [`GraphHopperIsochroneOpts`](../interfaces/GraphHopperIsochroneOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[src/graphhopper/index.ts:171](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L171)

___

### matrix

▸ **matrix**(`locations`, `profile`, `matrixOpts?`, `dryRun?`): `Promise`<`Matrix`<[`GraphHopperMatrixResponse`](../interfaces/GraphHopperMatrixResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`GraphHopperProfile`](../modules.md#graphhopperprofile) |
| `matrixOpts?` | [`GraphHopperMatrixOpts`](../interfaces/GraphHopperMatrixOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Matrix`<[`GraphHopperMatrixResponse`](../interfaces/GraphHopperMatrixResponse.md)\>\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[src/graphhopper/index.ts:242](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L242)

▸ **matrix**(`locations`, `profile`, `matrixOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`GraphHopperProfile`](../modules.md#graphhopperprofile) |
| `matrixOpts` | [`GraphHopperMatrixOpts`](../interfaces/GraphHopperMatrixOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[src/graphhopper/index.ts:248](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L248)

___

### parseDirectionsResponse

▸ `Static` **parseDirectionsResponse**(`response`): `Directions`<[`GraphHopperRouteResponse`](../interfaces/GraphHopperRouteResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`GraphHopperRouteResponse`](../interfaces/GraphHopperRouteResponse.md) |

#### Returns

`Directions`<[`GraphHopperRouteResponse`](../interfaces/GraphHopperRouteResponse.md)\>

#### Defined in

[src/graphhopper/index.ts:131](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L131)

___

### parseIsochroneResponse

▸ `Static` **parseIsochroneResponse**(`response`, `center`, `intervalType`): `Isochrones`<[`GraphHopperIsochroneResponse`](../interfaces/GraphHopperIsochroneResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`GraphHopperIsochroneResponse`](../interfaces/GraphHopperIsochroneResponse.md) |
| `center` | [`number`, `number`] |
| `intervalType` | ``"time"`` \| ``"distance"`` |

#### Returns

`Isochrones`<[`GraphHopperIsochroneResponse`](../interfaces/GraphHopperIsochroneResponse.md)\>

#### Defined in

[src/graphhopper/index.ts:224](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L224)

___

### parseMatrixResponse

▸ `Static` **parseMatrixResponse**(`response`): `Matrix`<[`GraphHopperMatrixResponse`](../interfaces/GraphHopperMatrixResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`GraphHopperMatrixResponse`](../interfaces/GraphHopperMatrixResponse.md) |

#### Returns

`Matrix`<[`GraphHopperMatrixResponse`](../interfaces/GraphHopperMatrixResponse.md)\>

#### Defined in

[src/graphhopper/index.ts:297](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L297)
