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

[valhalla/index.ts:71](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L71)

## Properties

### apiKey

• `Optional` `Readonly` **apiKey**: `string`

#### Defined in

[valhalla/index.ts:73](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L73)

___

### axiosOpts

• `Protected` `Optional` `Readonly` **axiosOpts**: `AxiosRequestConfig`<`any`\>

#### Defined in

[valhalla/index.ts:79](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L79)

___

### baseUrl

• `Readonly` **baseUrl**: `string` = `"https://valhalla1.openstreetmap.de"`

#### Defined in

[valhalla/index.ts:72](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L72)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[valhalla/index.ts:70](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L70)

___

### headers

• `Optional` `Readonly` **headers**: `Object`

#### Index signature

▪ [k: `string`]: `string`

#### Defined in

[valhalla/index.ts:77](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L77)

___

### maxRetries

• `Readonly` **maxRetries**: `number` = `options.defaultMaxRetries`

#### Defined in

[valhalla/index.ts:78](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L78)

___

### retryOverQueryLimit

• `Readonly` **retryOverQueryLimit**: `boolean` = `false`

#### Defined in

[valhalla/index.ts:76](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L76)

___

### timeout

• `Readonly` **timeout**: `number` = `options.defaultTimeout`

#### Defined in

[valhalla/index.ts:75](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L75)

___

### userAgent

• `Optional` `Readonly` **userAgent**: `string`

#### Defined in

[valhalla/index.ts:74](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L74)

## Methods

### directions

▸ **directions**(`locations`, `profile`, `directionsOpts?`, `dryRun?`): `Promise`<`Directions`<`ValhallaRouteResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `directionsOpts?` | `ValhallaDirectionOpts` |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Directions`<`ValhallaRouteResponse`\>\>

#### Implementation of

BaseRouter.directions

#### Defined in

[valhalla/index.ts:92](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L92)

▸ **directions**(`locations`, `profile`, `directionsOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `directionsOpts` | `ValhallaDirectionOpts` |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.directions

#### Defined in

[valhalla/index.ts:98](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L98)

___

### isochrones

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts?`, `dryRun?`): `Promise`<`Isochrones`<`ValhallaIsochroneResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `ValhallaCostingType` |
| `intervals` | `number`[] |
| `isochronesOpts?` | `ValhallaIsochroneOpts` |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Isochrones`<`ValhallaIsochroneResponse`\>\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[valhalla/index.ts:280](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L280)

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `ValhallaCostingType` |
| `intervals` | `number`[] |
| `isochronesOpts` | `ValhallaIsochroneOpts` |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[valhalla/index.ts:287](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L287)

___

### matrix

▸ **matrix**(`locations`, `profile`, `matrixOpts?`, `dryRun?`): `Promise`<`Matrix`<`ValhallaMatrixResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `matrixOpts?` | `ValhallaMatrixOpts` |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Matrix`<`ValhallaMatrixResponse`\>\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[valhalla/index.ts:463](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L463)

▸ **matrix**(`locations`, `profile`, `matrixOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `matrixOpts` | `ValhallaMatrixOpts` |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[valhalla/index.ts:469](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L469)

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

[valhalla/index.ts:618](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L618)

___

### getDirectionParams

▸ `Static` `Protected` **getDirectionParams**(`locations`, `profile`, `directionsOpts?`): `ValhallaRouteParams`

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `directionsOpts` | `ValhallaDirectionOpts` |

#### Returns

`ValhallaRouteParams`

#### Defined in

[valhalla/index.ts:136](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L136)

___

### getIsochroneParams

▸ `Static` **getIsochroneParams**(`location`, `profile`, `intervals`, `isochroneOpts?`): `ValhallaIsochroneParams`

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `ValhallaCostingType` |
| `intervals` | `number`[] |
| `isochroneOpts` | `ValhallaIsochroneOpts` |

#### Returns

`ValhallaIsochroneParams`

#### Defined in

[valhalla/index.ts:337](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L337)

___

### getMatrixParams

▸ `Static` **getMatrixParams**(`locations`, `profile`, `matrixOpts?`): `ValhallaMatrixParams`

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ValhallaCostingType` |
| `matrixOpts` | `ValhallaMatrixOpts` |

#### Returns

`ValhallaMatrixParams`

#### Defined in

[valhalla/index.ts:508](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L508)

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

[valhalla/index.ts:228](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L228)

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

[valhalla/index.ts:441](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L441)

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

[valhalla/index.ts:598](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/valhalla/index.ts#L598)
