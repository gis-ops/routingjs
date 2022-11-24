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

[src/valhalla/index.ts:54](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L54)

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

[src/valhalla/index.ts:61](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L61)

___

### colors

• `Optional` **colors**: `string`[]

The color for the output of the contour. Specify it as a Hex value, but without the #, such as
"color":"ff0000" for red. If no color is specified, the isochrone service will assign a default color to the output.

#### Defined in

[src/valhalla/index.ts:117](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L117)

___

### costingOpts

• `Optional` **costingOpts**: [`ValhallaCostingOptsAuto`](ValhallaCostingOptsAuto.md) \| [`ValhallaCostingOptsTruck`](ValhallaCostingOptsTruck.md) \| [`ValhallaCostingOptsBicycle`](ValhallaCostingOptsBicycle.md) \| [`ValhallaCostingOptsMotorcycle`](ValhallaCostingOptsMotorcycle.md) \| [`ValhallaCostingOptsPedestrian`](ValhallaCostingOptsPedestrian.md)

Profiles can have several options that can be adjusted to develop the route path,
       as well as for estimating time along the path. Only specify the actual options dict, the profile
       will be filled automatically. For more information, visit:
       https://github.com/valhalla/valhalla/blob/master/docs/api/turn-by-turn/api-reference.md#costing-options

#### Inherited from

ValhallaBaseOpts.costingOpts

#### Defined in

[src/valhalla/index.ts:45](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L45)

___

### dateTime

• `Optional` **dateTime**: [`ValhallaDateTime`](ValhallaDateTime.md)

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

[src/valhalla/index.ts:72](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L72)

___

### denoise

• `Optional` **denoise**: `number`

Can be used to remove smaller contours. In range [0, 1]. A value of 1 will only return the largest contour
for a given time value. A value of 0.5 drops any contours that are less than half the area of the largest
contour in the set of contours for that same time value. Default 1.

#### Defined in

[src/valhalla/index.ts:127](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L127)

___

### generalize

• `Optional` **generalize**: `number`

A floating point value in meters used as the tolerance for Douglas-Peucker generalization.
Note: Generalization of contours can lead to self-intersections, as well as intersections of adjacent contours.

#### Defined in

[src/valhalla/index.ts:132](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L132)

___

### id

• `Optional` **id**: `string`

A request ID that will be returned in the response

#### Inherited from

ValhallaBaseOpts.id

#### Defined in

[src/valhalla/index.ts:32](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L32)

___

### intervalType

• `Optional` **intervalType**: ``"time"`` \| ``"distance"``

Set 'time' for isochrones or 'distance' for equidistants.
Default 'time'.

#### Defined in

[src/valhalla/index.ts:112](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L112)

___

### polygons

• `Optional` **polygons**: `boolean`

Controls whether polygons or linestrings are returned in GeoJSON geometry. Default False.

#### Defined in

[src/valhalla/index.ts:121](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L121)

___

### preference

• `Optional` **preference**: ``"fastest"`` \| ``"shortest"``

Convenience argument to set the cost metric, one of ['shortest', 'fastest']. Note,
       that shortest is not guaranteed to be absolute shortest for motor vehicle profiles. It's called ``preference``
       to be in line with the already existing parameter in the ORS adapter.

#### Inherited from

ValhallaBaseOpts.preference

#### Defined in

[src/valhalla/index.ts:38](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L38)

___

### showLocations

• `Optional` **showLocations**: `boolean`

A boolean indicating whether the input locations should be returned as MultiPoint features: one feature for the exact input coordinates and one feature
for the coordinates of the network node it snapped to. Default false.

#### Defined in

[src/valhalla/index.ts:137](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L137)
