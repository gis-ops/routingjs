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

• **new Valhalla**(`baseUrl?`, `apiKey?`, `userAgent?`, `timeout?`, `retryOverQueryLimit?`, `headers?`, `maxRetries?`, `axiosOpts?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `baseUrl` | `string` | `"https://valhalla1.openstreetmap.de"` |
| `apiKey?` | `string` | `undefined` |
| `userAgent?` | `string` | `undefined` |
| `timeout` | `number` | `options.defaultTimeout` |
| `retryOverQueryLimit` | `boolean` | `false` |
| `headers?` | `Object` | `undefined` |
| `maxRetries` | `number` | `options.defaultMaxRetries` |
| `axiosOpts?` | `AxiosRequestConfig`<`any`\> | `undefined` |

#### Defined in

[valhalla/index.ts:102](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L102)

## Properties

### apiKey

• `Optional` `Readonly` **apiKey**: `string`

#### Defined in

[valhalla/index.ts:104](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L104)

___

### axiosOpts

• `Protected` `Optional` `Readonly` **axiosOpts**: `AxiosRequestConfig`<`any`\>

#### Defined in

[valhalla/index.ts:110](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L110)

___

### baseUrl

• `Readonly` **baseUrl**: `string` = `"https://valhalla1.openstreetmap.de"`

#### Defined in

[valhalla/index.ts:103](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L103)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[valhalla/index.ts:101](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L101)

___

### headers

• `Optional` `Readonly` **headers**: `Object`

#### Index signature

▪ [k: `string`]: `string`

#### Defined in

[valhalla/index.ts:108](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L108)

___

### maxRetries

• `Readonly` **maxRetries**: `number` = `options.defaultMaxRetries`

#### Defined in

[valhalla/index.ts:109](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L109)

___

### retryOverQueryLimit

• `Readonly` **retryOverQueryLimit**: `boolean` = `false`

#### Defined in

[valhalla/index.ts:107](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L107)

___

### timeout

• `Readonly` **timeout**: `number` = `options.defaultTimeout`

#### Defined in

[valhalla/index.ts:106](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L106)

___

### userAgent

• `Optional` `Readonly` **userAgent**: `string`

#### Defined in

[valhalla/index.ts:105](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L105)

## Methods

### directions

▸ **directions**(`locations`, `profile`, `directionsOpts?`, `dryRun?`): `Promise`<`Directions`<`ValhallaRouteResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `directionsOpts?` | [`ValhallaDirectionOpts`](../interfaces/ValhallaDirectionOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Directions`<`ValhallaRouteResponse`\>\>

#### Implementation of

BaseRouter.directions

#### Defined in

[valhalla/index.ts:123](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L123)

▸ **directions**(`locations`, `profile`, `directionsOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `directionsOpts` | [`ValhallaDirectionOpts`](../interfaces/ValhallaDirectionOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.directions

#### Defined in

[valhalla/index.ts:129](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L129)

___

### isochrones

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts?`, `dryRun?`): `Promise`<`Isochrones`<`ValhallaIsochroneResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `ValhallaCostingType` |
| `intervals` | `number`[] |
| `isochronesOpts?` | [`ValhallaIsochroneOpts`](../interfaces/ValhallaIsochroneOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Isochrones`<`ValhallaIsochroneResponse`\>\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[valhalla/index.ts:311](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L311)

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `ValhallaCostingType` |
| `intervals` | `number`[] |
| `isochronesOpts` | [`ValhallaIsochroneOpts`](../interfaces/ValhallaIsochroneOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[valhalla/index.ts:318](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L318)

___

### matrix

▸ **matrix**(`locations`, `profile`, `matrixOpts?`, `dryRun?`): `Promise`<`Matrix`<`ValhallaMatrixResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `matrixOpts?` | [`ValhallaMatrixOpts`](../interfaces/ValhallaMatrixOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Matrix`<`ValhallaMatrixResponse`\>\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[valhalla/index.ts:494](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L494)

▸ **matrix**(`locations`, `profile`, `matrixOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `matrixOpts` | [`ValhallaMatrixOpts`](../interfaces/ValhallaMatrixOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[valhalla/index.ts:500](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L500)

___

### \_buildLocations

▸ `Static` `Protected` **_buildLocations**(`coordinates`): `ValhallaLocation`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coordinates` | [`number`, `number`] \| [`number`, `number`][] |

#### Returns

`ValhallaLocation`[]

#### Defined in

[valhalla/index.ts:649](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L649)

___

### getDirectionParams

▸ `Static` `Protected` **getDirectionParams**(`locations`, `profile`, `directionsOpts?`): `ValhallaRouteParams`

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `directionsOpts` | [`ValhallaDirectionOpts`](../interfaces/ValhallaDirectionOpts.md) |

#### Returns

`ValhallaRouteParams`

#### Defined in

[valhalla/index.ts:167](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L167)

___

### getIsochroneParams

▸ `Static` **getIsochroneParams**(`location`, `profile`, `intervals`, `isochroneOpts?`): `ValhallaIsochroneParams`

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `ValhallaCostingType` |
| `intervals` | `number`[] |
| `isochroneOpts` | [`ValhallaIsochroneOpts`](../interfaces/ValhallaIsochroneOpts.md) |

#### Returns

`ValhallaIsochroneParams`

#### Defined in

[valhalla/index.ts:368](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L368)

___

### getMatrixParams

▸ `Static` **getMatrixParams**(`locations`, `profile`, `matrixOpts?`): `ValhallaMatrixParams`

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `matrixOpts` | [`ValhallaMatrixOpts`](../interfaces/ValhallaMatrixOpts.md) |

#### Returns

`ValhallaMatrixParams`

#### Defined in

[valhalla/index.ts:539](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L539)

___

### parseDirectionsResponse

▸ `Static` **parseDirectionsResponse**(`response`, `type?`): `Direction` \| `Directions`<`ValhallaRouteResponse`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `response` | `ValhallaRouteResponse` | `undefined` |
| `type` | ``"main"`` \| ``"alternative"`` | `"main"` |

#### Returns

`Direction` \| `Directions`<`ValhallaRouteResponse`\>

#### Defined in

[valhalla/index.ts:259](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L259)

___

### parseIsochroneResponse

▸ `Static` **parseIsochroneResponse**(`response`, `location`, `intervals`, `intervalType`): `Isochrones`<`ValhallaIsochroneResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `ValhallaIsochroneResponse` |
| `location` | [`number`, `number`] |
| `intervals` | `number`[] |
| `intervalType` | ``"time"`` \| ``"distance"`` |

#### Returns

`Isochrones`<`ValhallaIsochroneResponse`\>

#### Defined in

[valhalla/index.ts:472](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L472)

___

### parseMatrixResponse

▸ `Static` **parseMatrixResponse**(`response`, `units`): `Matrix`<`ValhallaMatrixResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `ValhallaMatrixResponse` |
| `units` | `ValhallaRequestUnit` |

#### Returns

`Matrix`<`ValhallaMatrixResponse`\>

#### Defined in

[valhalla/index.ts:629](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L629)
