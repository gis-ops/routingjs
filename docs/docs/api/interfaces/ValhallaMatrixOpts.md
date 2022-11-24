---
id: "ValhallaMatrixOpts"
title: "Interface: ValhallaMatrixOpts"
sidebar_label: "ValhallaMatrixOpts"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `ValhallaBaseOpts`

  ↳ **`ValhallaMatrixOpts`**

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

### destinations

• `Optional` **destinations**: `number`[]

#### Defined in

[src/valhalla/index.ts:142](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L142)

___

### id

• `Optional` **id**: `string`

A request ID that will be returned in the response

#### Inherited from

ValhallaBaseOpts.id

#### Defined in

[src/valhalla/index.ts:32](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L32)

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

### sources

• `Optional` **sources**: `number`[]

#### Defined in

[src/valhalla/index.ts:141](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L141)

___

### units

• `Optional` **units**: [`ValhallaRequestUnit`](../modules.md#valhallarequestunit)

#### Defined in

[src/valhalla/index.ts:143](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L143)
