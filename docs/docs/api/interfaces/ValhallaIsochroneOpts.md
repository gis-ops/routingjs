---
id: "ValhallaIsochroneOpts"
title: "Interface: ValhallaIsochroneOpts"
sidebar_label: "ValhallaIsochroneOpts"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `ValhallaBaseOpts`

  ↳ **`ValhallaIsochroneOpts`**

## Properties

### avoidLocations

• `Optional` **avoidLocations**: ([`number`, `number`] \| `Point` \| `Feature`<`Point`, `any`\>)[]

A set of locations to exclude or avoid within a route.

#### Inherited from

ValhallaBaseOpts.avoidLocations

#### Defined in

[valhalla/index.ts:56](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L56)

___

### avoidPolygons

• `Optional` **avoidPolygons**: (`Polygon` \| [`number`, `number`][][] \| `Feature`<`Polygon`, `any`\>)[]

Roads intersecting these polygons
       will be avoided during path finding. If you only need to avoid a few specific roads, it's much more
       efficient to use avoid_locations. Valhalla will close open rings (i.e. copy the first coordingate to the
       last position).

#### Inherited from

ValhallaBaseOpts.avoidPolygons

#### Defined in

[valhalla/index.ts:63](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L63)

___

### colors

• `Optional` **colors**: `string`[]

#### Defined in

[valhalla/index.ts:87](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L87)

___

### costingOpts

• `Optional` **costingOpts**: `ValhallaCostingOptsAuto` \| `ValhallaCostingOptsTruck` \| `ValhallaCostingOptsBicycle` \| `ValhallaCostingOptsMotorcycle` \| `ValhallaCostingOptsPedestrian`

Profiles can have several options that can be adjusted to develop the route path,
       as well as for estimating time along the path. Only specify the actual options dict, the profile
       will be filled automatically. For more information, visit:
       https://github.com/valhalla/valhalla/blob/master/docs/api/turn-by-turn/api-reference.md#costing-options

#### Inherited from

ValhallaBaseOpts.costingOpts

#### Defined in

[valhalla/index.ts:47](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L47)

___

### dateTime

• `Optional` **dateTime**: `ValhallaDateTime`

This is the local date and time at the location. Field `type`: 0: Current departure time,
  1: Specified departure time. Field `value`: the date and time is specified
  in ISO 8601 format (YYYY-MM-DDThh:mm), local time.

**`Example`**

```js
   date_time = {type: 0, value: 2021-03-03T08:06:23}
   ```

#### Inherited from

ValhallaBaseOpts.dateTime

#### Defined in

[valhalla/index.ts:74](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L74)

___

### denoise

• `Optional` **denoise**: `number`

#### Defined in

[valhalla/index.ts:89](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L89)

___

### generalize

• `Optional` **generalize**: `number`

#### Defined in

[valhalla/index.ts:90](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L90)

___

### id

• `Optional` **id**: `string`

A request ID that will be returned in the response

#### Inherited from

ValhallaBaseOpts.id

#### Defined in

[valhalla/index.ts:34](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L34)

___

### intervalType

• `Optional` **intervalType**: ``"time"`` \| ``"distance"``

#### Defined in

[valhalla/index.ts:86](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L86)

___

### polygons

• `Optional` **polygons**: `boolean`

#### Defined in

[valhalla/index.ts:88](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L88)

___

### preference

• `Optional` **preference**: ``"fastest"`` \| ``"shortest"``

Convenience argument to set the cost metric, one of ['shortest', 'fastest']. Note,
       that shortest is not guaranteed to be absolute shortest for motor vehicle profiles. It's called ``preference``
       to be in line with the already existing parameter in the ORS adapter.

#### Inherited from

ValhallaBaseOpts.preference

#### Defined in

[valhalla/index.ts:40](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L40)

___

### showLocations

• `Optional` **showLocations**: `boolean`

#### Defined in

[valhalla/index.ts:91](https://github.com/chrstnbwnkl/routing-js/blob/f20a7c7/src/valhalla/index.ts#L91)
