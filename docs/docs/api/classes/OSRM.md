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

• **new OSRM**(`clientArgs`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `clientArgs` | `ClientConstructorArgs` |

#### Defined in

[src/osrm/index.ts:39](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L39)

## Properties

### apiKey

• `Optional` **apiKey**: `string`

#### Defined in

[src/osrm/index.ts:38](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L38)

___

### client

• **client**: `Client`

#### Implementation of

BaseRouter.client

#### Defined in

[src/osrm/index.ts:37](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L37)

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

[src/osrm/index.ts:66](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L66)

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

[src/osrm/index.ts:72](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L72)

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

[src/osrm/index.ts:201](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L201)

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

[src/osrm/index.ts:207](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L207)

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

[src/osrm/index.ts:106](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L106)

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

[src/osrm/index.ts:241](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L241)

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

[src/osrm/index.ts:157](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L157)

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

[src/osrm/index.ts:180](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L180)

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

[src/osrm/index.ts:274](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/osrm/index.ts#L274)
