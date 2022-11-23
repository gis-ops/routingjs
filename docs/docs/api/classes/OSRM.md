---
id: "OSRM"
title: "Class: OSRM"
sidebar_label: "OSRM"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- `BaseRouter`

## Constructors

### constructor

• **new OSRM**(`baseUrl?`, `apiKey?`, `userAgent?`, `headers?`, `timeout?`, `retryOverQueryLimit?`, `maxRetries?`, `axiosOpts?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `baseUrl` | `string` | `"https://routing.openstreetmap.de/routed-bike"` |
| `apiKey?` | `string` | `undefined` |
| `userAgent?` | `string` | `undefined` |
| `headers?` | `Object` | `undefined` |
| `timeout` | `number` | `options.defaultTimeout` |
| `retryOverQueryLimit` | `boolean` | `false` |
| `maxRetries` | `number` | `options.defaultMaxRetries` |
| `axiosOpts?` | `AxiosRequestConfig`<`any`\> | `undefined` |

#### Defined in

[osrm/index.ts:40](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L40)

## Properties

### apiKey

• `Optional` `Readonly` **apiKey**: `string`

#### Defined in

[osrm/index.ts:42](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L42)

___

### axiosOpts

• `Protected` `Optional` `Readonly` **axiosOpts**: `AxiosRequestConfig`<`any`\>

#### Defined in

[osrm/index.ts:48](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L48)

___

### baseUrl

• `Readonly` **baseUrl**: `string` = `"https://routing.openstreetmap.de/routed-bike"`

#### Defined in

[osrm/index.ts:41](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L41)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[osrm/index.ts:39](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L39)

___

### headers

• `Optional` `Readonly` **headers**: `Object`

#### Index signature

▪ [k: `string`]: `string`

#### Defined in

[osrm/index.ts:44](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L44)

___

### maxRetries

• `Readonly` **maxRetries**: `number` = `options.defaultMaxRetries`

#### Defined in

[osrm/index.ts:47](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L47)

___

### retryOverQueryLimit

• `Readonly` **retryOverQueryLimit**: `boolean` = `false`

#### Defined in

[osrm/index.ts:46](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L46)

___

### timeout

• `Readonly` **timeout**: `number` = `options.defaultTimeout`

#### Defined in

[osrm/index.ts:45](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L45)

___

### userAgent

• `Optional` `Readonly` **userAgent**: `string`

#### Defined in

[osrm/index.ts:43](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L43)

## Methods

### directions

▸ **directions**(`locations`, `profile`, `directionsOpts?`, `dryRun?`): `Promise`<`Directions`<`OSRMRouteResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `string` |
| `directionsOpts?` | [`OSRMDirectionsOpts`](../interfaces/OSRMDirectionsOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Directions`<`OSRMRouteResponse`\>\>

#### Implementation of

BaseRouter.directions

#### Defined in

[osrm/index.ts:61](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L61)

▸ **directions**(`locations`, `profile`, `directionsOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `string` |
| `directionsOpts` | [`OSRMDirectionsOpts`](../interfaces/OSRMDirectionsOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.directions

#### Defined in

[osrm/index.ts:67](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L67)

___

### matrix

▸ **matrix**(`locations`, `profile`, `matrixOpts?`, `dryRun?`): `Promise`<`Matrix`<`OSRMTableResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `string` |
| `matrixOpts?` | [`OSRMMatrixOpts`](../interfaces/OSRMMatrixOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Matrix`<`OSRMTableResponse`\>\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[osrm/index.ts:196](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L196)

▸ **matrix**(`locations`, `profile`, `matrixOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `string` |
| `matrixOpts` | [`OSRMMatrixOpts`](../interfaces/OSRMMatrixOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[osrm/index.ts:202](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L202)

___

### getDirectionParams

▸ `Static` `Protected` **getDirectionParams**(`directionsOpts?`): `Partial`<`OSRMRouteParams`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `directionsOpts` | [`OSRMDirectionsOpts`](../interfaces/OSRMDirectionsOpts.md) |

#### Returns

`Partial`<`OSRMRouteParams`\>

#### Defined in

[osrm/index.ts:101](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L101)

___

### getMatrixParams

▸ `Static` `Protected` **getMatrixParams**(`matrixOpts`): `Partial`<`OSRMTableParams`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrixOpts` | [`OSRMMatrixOpts`](../interfaces/OSRMMatrixOpts.md) |

#### Returns

`Partial`<`OSRMTableParams`\>

#### Defined in

[osrm/index.ts:236](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L236)

___

### parseDirectionsResponse

▸ `Static` **parseDirectionsResponse**(`response`, `geometryFormat?`): `Directions`<`OSRMRouteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `OSRMRouteResponse` |
| `geometryFormat?` | `OSRMGeometryType` |

#### Returns

`Directions`<`OSRMRouteResponse`\>

#### Defined in

[osrm/index.ts:152](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L152)

___

### parseGeometry

▸ `Static` `Protected` **parseGeometry**(`routeGeometry`, `geometryFormat?`): `OSRMGeometryObject`

#### Parameters

| Name | Type |
| :------ | :------ |
| `routeGeometry` | `string` \| `OSRMGeometryObject` |
| `geometryFormat?` | `OSRMGeometryType` |

#### Returns

`OSRMGeometryObject`

#### Defined in

[osrm/index.ts:175](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L175)

___

### parseMatrixResponse

▸ `Static` **parseMatrixResponse**(`response`): `Matrix`<`OSRMTableResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `OSRMTableResponse` |

#### Returns

`Matrix`<`OSRMTableResponse`\>

#### Defined in

[osrm/index.ts:269](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/osrm/index.ts#L269)
