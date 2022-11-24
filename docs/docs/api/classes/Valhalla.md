---
id: "Valhalla"
title: "Class: Valhalla"
sidebar_label: "Valhalla"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- `BaseRouter`

## Constructors

### constructor

• **new Valhalla**(`clientArgs`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientArgs` | `ClientConstructorArgs` |

#### Defined in

[src/valhalla/index.ts:149](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L149)

## Properties

### apiKey

• `Optional` **apiKey**: `string`

#### Defined in

[src/valhalla/index.ts:148](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L148)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[src/valhalla/index.ts:147](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L147)

## Methods

### directions

▸ **directions**(`locations`, `profile`, `directionsOpts?`, `dryRun?`): `Promise`<`Directions`<[`ValhallaRouteResponse`](../interfaces/ValhallaRouteResponse.md)\>\>

Makes a request to Valhalla's `/route` endpoint.

**`See`**

[ValhallaCostingType](../modules.md#valhallacostingtype) for available profiles

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `locations` | [`number`, `number`][] | The coordinates tuple the route should be calculated from in order of visit. |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) | Specifies the mode of transport |
| `directionsOpts?` | [`ValhallaDirectionOpts`](../interfaces/ValhallaDirectionOpts.md) | Additional parameters, such as costing options. |
| `dryRun?` | ``false`` | if true, will not make the request and instead return an info string containing the URL and request parameters; for debugging |

#### Returns

`Promise`<`Directions`<[`ValhallaRouteResponse`](../interfaces/ValhallaRouteResponse.md)\>\>

#### Implementation of

BaseRouter.directions

#### Defined in

[src/valhalla/index.ts:185](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L185)

▸ **directions**(`locations`, `profile`, `directionsOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) |
| `directionsOpts` | [`ValhallaDirectionOpts`](../interfaces/ValhallaDirectionOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.directions

#### Defined in

[src/valhalla/index.ts:191](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L191)

___

### isochrones

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts?`, `dryRun?`): `Promise`<`Isochrones`<[`ValhallaIsochroneResponse`](../interfaces/ValhallaIsochroneResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) |
| `intervals` | `number`[] |
| `isochronesOpts?` | [`ValhallaIsochroneOpts`](../interfaces/ValhallaIsochroneOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Isochrones`<[`ValhallaIsochroneResponse`](../interfaces/ValhallaIsochroneResponse.md)\>\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[src/valhalla/index.ts:376](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L376)

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) |
| `intervals` | `number`[] |
| `isochronesOpts` | [`ValhallaIsochroneOpts`](../interfaces/ValhallaIsochroneOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[src/valhalla/index.ts:383](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L383)

___

### matrix

▸ **matrix**(`locations`, `profile`, `matrixOpts?`, `dryRun?`): `Promise`<`Matrix`<[`ValhallaMatrixResponse`](../interfaces/ValhallaMatrixResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) |
| `matrixOpts?` | [`ValhallaMatrixOpts`](../interfaces/ValhallaMatrixOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Matrix`<[`ValhallaMatrixResponse`](../interfaces/ValhallaMatrixResponse.md)\>\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[src/valhalla/index.ts:563](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L563)

▸ **matrix**(`locations`, `profile`, `matrixOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) |
| `matrixOpts` | [`ValhallaMatrixOpts`](../interfaces/ValhallaMatrixOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[src/valhalla/index.ts:569](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L569)

___

### \_buildLocations

▸ `Static` `Protected` **_buildLocations**(`coordinates`): [`ValhallaLocation`](../interfaces/ValhallaLocation.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | [`number`, `number`] \| [`number`, `number`][] |

#### Returns

[`ValhallaLocation`](../interfaces/ValhallaLocation.md)[]

#### Defined in

[src/valhalla/index.ts:720](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L720)

___

### getDirectionParams

▸ `Static` `Protected` **getDirectionParams**(`locations`, `profile`, `directionsOpts?`): [`ValhallaRouteParams`](../interfaces/ValhallaRouteParams.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) |
| `directionsOpts` | [`ValhallaDirectionOpts`](../interfaces/ValhallaDirectionOpts.md) |

#### Returns

[`ValhallaRouteParams`](../interfaces/ValhallaRouteParams.md)

#### Defined in

[src/valhalla/index.ts:229](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L229)

___

### getIsochroneParams

▸ `Static` **getIsochroneParams**(`location`, `profile`, `intervals`, `isochroneOpts?`): [`ValhallaIsochroneParams`](../interfaces/ValhallaIsochroneParams.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) |
| `intervals` | `number`[] |
| `isochroneOpts` | [`ValhallaIsochroneOpts`](../interfaces/ValhallaIsochroneOpts.md) |

#### Returns

[`ValhallaIsochroneParams`](../interfaces/ValhallaIsochroneParams.md)

#### Defined in

[src/valhalla/index.ts:433](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L433)

___

### getMatrixParams

▸ `Static` **getMatrixParams**(`locations`, `profile`, `matrixOpts?`): [`ValhallaMatrixParams`](../interfaces/ValhallaMatrixParams.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ValhallaCostingType`](../modules.md#valhallacostingtype) |
| `matrixOpts` | [`ValhallaMatrixOpts`](../interfaces/ValhallaMatrixOpts.md) |

#### Returns

[`ValhallaMatrixParams`](../interfaces/ValhallaMatrixParams.md)

#### Defined in

[src/valhalla/index.ts:608](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L608)

___

### parseDirectionsResponse

▸ `Static` **parseDirectionsResponse**(`response`, `type?`): `Direction` \| `Directions`<[`ValhallaRouteResponse`](../interfaces/ValhallaRouteResponse.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `response` | [`ValhallaRouteResponse`](../interfaces/ValhallaRouteResponse.md) | `undefined` |
| `type` | ``"main"`` \| ``"alternative"`` | `"main"` |

#### Returns

`Direction` \| `Directions`<[`ValhallaRouteResponse`](../interfaces/ValhallaRouteResponse.md)\>

#### Defined in

[src/valhalla/index.ts:323](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L323)

___

### parseIsochroneResponse

▸ `Static` **parseIsochroneResponse**(`response`, `location`, `intervals`, `intervalType`): `Isochrones`<[`ValhallaIsochroneResponse`](../interfaces/ValhallaIsochroneResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`ValhallaIsochroneResponse`](../interfaces/ValhallaIsochroneResponse.md) |
| `location` | [`number`, `number`] |
| `intervals` | `number`[] |
| `intervalType` | ``"time"`` \| ``"distance"`` |

#### Returns

`Isochrones`<[`ValhallaIsochroneResponse`](../interfaces/ValhallaIsochroneResponse.md)\>

#### Defined in

[src/valhalla/index.ts:540](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L540)

___

### parseMatrixResponse

▸ `Static` **parseMatrixResponse**(`response`, `units`): `Matrix`<[`ValhallaMatrixResponse`](../interfaces/ValhallaMatrixResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`ValhallaMatrixResponse`](../interfaces/ValhallaMatrixResponse.md) |
| `units` | [`ValhallaRequestUnit`](../modules.md#valhallarequestunit) |

#### Returns

`Matrix`<[`ValhallaMatrixResponse`](../interfaces/ValhallaMatrixResponse.md)\>

#### Defined in

[src/valhalla/index.ts:700](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L700)
