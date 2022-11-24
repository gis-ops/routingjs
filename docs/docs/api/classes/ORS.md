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

• **new ORS**(`clientArgs`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientArgs` | `ClientConstructorArgs` |

#### Defined in

[src/ors/index.ts:67](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L67)

## Properties

### apiKey

• `Optional` **apiKey**: `string`

#### Defined in

[src/ors/index.ts:66](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L66)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[src/ors/index.ts:65](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L65)

## Methods

### directions

▸ **directions**(`locations`, `profile`, `directionsOpts?`, `dryRun?`, `format?`): `Promise`<`Directions`<[`ORSRouteResponse`](../interfaces/ORSRouteResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ORSProfile`](../modules.md#orsprofile) |
| `directionsOpts?` | [`ORSDirectionsOpts`](../interfaces/ORSDirectionsOpts.md) |
| `dryRun?` | ``false`` |
| `format?` | [`ORSFormat`](../modules.md#orsformat) |

#### Returns

`Promise`<`Directions`<[`ORSRouteResponse`](../interfaces/ORSRouteResponse.md)\>\>

#### Implementation of

BaseRouter.directions

#### Defined in

[src/ors/index.ts:96](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L96)

▸ **directions**(`locations`, `profile`, `directionsOpts`, `dryRun`, `format?`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ORSProfile`](../modules.md#orsprofile) |
| `directionsOpts` | [`ORSDirectionsOpts`](../interfaces/ORSDirectionsOpts.md) |
| `dryRun` | ``true`` |
| `format?` | [`ORSFormat`](../modules.md#orsformat) |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.directions

#### Defined in

[src/ors/index.ts:103](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L103)

___

### isochrones

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts?`, `dryRun?`): `Promise`<`Isochrones`<[`ORSIsochroneResponse`](../interfaces/ORSIsochroneResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `string` |
| `intervals` | `number`[] |
| `isochronesOpts?` | [`ORSIsochroneOpts`](../interfaces/ORSIsochroneOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Isochrones`<[`ORSIsochroneResponse`](../interfaces/ORSIsochroneResponse.md)\>\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[src/ors/index.ts:220](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L220)

▸ **isochrones**(`location`, `profile`, `intervals`, `isochronesOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | [`number`, `number`] |
| `profile` | `string` |
| `intervals` | `number`[] |
| `isochronesOpts` | [`ORSIsochroneOpts`](../interfaces/ORSIsochroneOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.isochrones

#### Defined in

[src/ors/index.ts:227](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L227)

___

### matrix

▸ **matrix**(`locations`, `profile`, `matrixOpts?`, `dryRun?`): `Promise`<`Matrix`<[`ORSMatrixResponse`](../interfaces/ORSMatrixResponse.md)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ORSProfile`](../modules.md#orsprofile) |
| `matrixOpts?` | [`ORSMatrixOpts`](../interfaces/ORSMatrixOpts.md) |
| `dryRun?` | ``false`` |

#### Returns

`Promise`<`Matrix`<[`ORSMatrixResponse`](../interfaces/ORSMatrixResponse.md)\>\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[src/ors/index.ts:290](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L290)

▸ **matrix**(`locations`, `profile`, `matrixOpts`, `dryRun`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `locations` | [`number`, `number`][] |
| `profile` | [`ORSProfile`](../modules.md#orsprofile) |
| `matrixOpts` | [`ORSMatrixOpts`](../interfaces/ORSMatrixOpts.md) |
| `dryRun` | ``true`` |

#### Returns

`Promise`<`string`\>

#### Implementation of

BaseRouter.matrix

#### Defined in

[src/ors/index.ts:296](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L296)

___

### parseDirectionsResponse

▸ `Static` **parseDirectionsResponse**(`response`, `format`, `units?`, `alternative_routes?`): `Directions`<[`ORSRouteResponse`](../interfaces/ORSRouteResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`ORSRouteResponse`](../interfaces/ORSRouteResponse.md) |
| `format` | [`ORSFormat`](../modules.md#orsformat) |
| `units?` | [`ORSUnit`](../modules.md#orsunit) |
| `alternative_routes?` | [`ORSAlternateRouteParam`](../interfaces/ORSAlternateRouteParam.md) |

#### Returns

`Directions`<[`ORSRouteResponse`](../interfaces/ORSRouteResponse.md)\>

#### Defined in

[src/ors/index.ts:158](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L158)

___

### parseIsochroneResponse

▸ `Static` **parseIsochroneResponse**(`response`, `intervalType?`): `Isochrones`<[`ORSIsochroneResponse`](../interfaces/ORSIsochroneResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`ORSIsochroneResponse`](../interfaces/ORSIsochroneResponse.md) |
| `intervalType?` | ``"time"`` \| ``"distance"`` |

#### Returns

`Isochrones`<[`ORSIsochroneResponse`](../interfaces/ORSIsochroneResponse.md)\>

#### Defined in

[src/ors/index.ts:270](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L270)

___

### parseMatrixResponse

▸ `Static` **parseMatrixResponse**(`response`): `Matrix`<[`ORSMatrixResponse`](../interfaces/ORSMatrixResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`ORSMatrixResponse`](../interfaces/ORSMatrixResponse.md) |

#### Returns

`Matrix`<[`ORSMatrixResponse`](../interfaces/ORSMatrixResponse.md)\>

#### Defined in

[src/ors/index.ts:330](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/index.ts#L330)
