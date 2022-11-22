---
id: "ORS"
title: "Class: ORS"
sidebar_label: "ORS"
sidebar_position: 0
custom_edit_url: null
---

## Implements

- `BaseRouter`

## Constructors

### constructor

• **new ORS**(`apiKey?`, `baseUrl?`, `userAgent?`, `headers?`, `timeout?`, `retryOverQueryLimit?`, `maxRetries?`, `axiosOpts?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `apiKey?` | `string` | `undefined` |
| `baseUrl` | `string` | `"https://api.openrouteservice.org"` |
| `userAgent?` | `string` | `undefined` |
| `headers?` | `Object` | `undefined` |
| `timeout` | `number` | `options.defaultTimeout` |
| `retryOverQueryLimit` | `boolean` | `false` |
| `maxRetries` | `number` | `options.defaultMaxRetries` |
| `axiosOpts?` | `AxiosRequestConfig`<`any`\> | `undefined` |

#### Defined in

[ors/index.ts:68](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L68)

## Properties

### apiKey

• `Optional` `Readonly` **apiKey**: `string`

#### Defined in

[ors/index.ts:69](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L69)

___

### axiosOpts

• `Protected` `Optional` `Readonly` **axiosOpts**: `AxiosRequestConfig`<`any`\>

#### Defined in

[ors/index.ts:76](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L76)

___

### baseUrl

• `Readonly` **baseUrl**: `string` = `"https://api.openrouteservice.org"`

#### Defined in

[ors/index.ts:70](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L70)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[ors/index.ts:67](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L67)

___

### headers

• `Optional` `Readonly` **headers**: `Object`

#### Index signature

▪ [k: `string`]: `string`

#### Defined in

[ors/index.ts:72](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L72)

___

### maxRetries

• `Readonly` **maxRetries**: `number` = `options.defaultMaxRetries`

#### Defined in

[ors/index.ts:75](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L75)

___

### retryOverQueryLimit

• `Readonly` **retryOverQueryLimit**: `boolean` = `false`

#### Defined in

[ors/index.ts:74](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L74)

___

### timeout

• `Readonly` **timeout**: `number` = `options.defaultTimeout`

#### Defined in

[ors/index.ts:73](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L73)

___

### userAgent

• `Optional` `Readonly` **userAgent**: `string`

#### Defined in

[ors/index.ts:71](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L71)

## Methods

### directions

▸ **directions**(`locations`, `profile`, `directionsOpts?`, `dryRun?`, `format?`): `Promise`<`Directions`<`ORSRouteResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ORSProfile` |
| `directionsOpts?` | `OSRMDirectionsOpts` |
| `dryRun?` | ``false`` |
| `format?` | `ORSFormat` |

#### Returns

`Promise`<`Directions`<`ORSRouteResponse`\>\>

#### Implementation of

BaseRouter.directions

#### Defined in

[ors/index.ts:96](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L96)

▸ **directions**(`locations`, `profile`, `directionsOpts`, `dryRun`, `format?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ORSProfile` |
| `directionsOpts` | `OSRMDirectionsOpts` |
| `dryRun` | ``true`` |
| `format?` | `ORSFormat` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.directions

#### Defined in

[ors/index.ts:103](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L103)

___

### isochrones

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts?`, `dryRun?`): `Promise`<`Isochrones`<`ORSIsochroneResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `string` |
| `intervals` | `number`[] |
| `isochronesOpts?` | `OSRIsochroneOpts` |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Isochrones`<`ORSIsochroneResponse`\>\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[ors/index.ts:220](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L220)

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `string` |
| `intervals` | `number`[] |
| `isochronesOpts` | `OSRIsochroneOpts` |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[ors/index.ts:227](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L227)

___

### matrix

▸ **matrix**(`locations`, `profile`, `matrixOpts?`, `dryRun?`): `Promise`<`Matrix`<`ORSMatrixResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ORSProfile` |
| `matrixOpts?` | `ORSMatrixOpts` |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Matrix`<`ORSMatrixResponse`\>\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[ors/index.ts:290](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L290)

▸ **matrix**(`locations`, `profile`, `matrixOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | `ORSProfile` |
| `matrixOpts` | `ORSMatrixOpts` |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[ors/index.ts:296](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L296)

___

### parseDirectionsResponse

▸ `Static` **parseDirectionsResponse**(`response`, `format`, `units?`, `alternative_routes?`): `Directions`<`ORSRouteResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `ORSRouteResponse` |
| `format` | `ORSFormat` |
| `units?` | `ORSUnit` |
| `alternative_routes?` | `ORSAlternateRouteParam` |

#### Returns

`Directions`<`ORSRouteResponse`\>

#### Defined in

[ors/index.ts:158](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L158)

___

### parseIsochroneResponse

▸ `Static` **parseIsochroneResponse**(`response`, `intervalType?`): `Isochrones`<`ORSIsochroneResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `ORSIsochroneResponse` |
| `intervalType?` | ``"time"`` \| ``"distance"`` |

#### Returns

`Isochrones`<`ORSIsochroneResponse`\>

#### Defined in

[ors/index.ts:270](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L270)

___

### parseMatrixResponse

▸ `Static` **parseMatrixResponse**(`response`): `Matrix`<`ORSMatrixResponse`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `ORSMatrixResponse` |

#### Returns

`Matrix`<`ORSMatrixResponse`\>

#### Defined in

[ors/index.ts:330](https://github.com/chrstnbwnkl/routing-js/blob/dcef747/src/ors/index.ts#L330)
