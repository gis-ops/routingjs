---
id: "ValhallaDirectionOpts"
title: "Interface: ValhallaDirectionOpts"
sidebar_label: "ValhallaDirectionOpts"
sidebar_position: 0
custom_edit_url: null
---

## Hierarchy

- `ValhallaBaseOpts`

  ↳ **`ValhallaDirectionOpts`**

## Properties

### alternatives

• `Optional` **alternatives**: `number`

A number denoting how many alternate routes should be provided.
There may be no alternates or less alternates than the user specifies.
 Alternates are not yet supported on multipoint routes (that is, routes with
more than 2 locations). They are also not supported on time dependent routes.

#### Defined in

[src/valhalla/index.ts:86](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L86)

___

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

### directionsType

• `Optional` **directionsType**: [`ValhallaDirectionsType`](../modules.md#valhalladirectionstype)

'none': no instructions are returned. 'maneuvers': only maneuvers are returned.
'instructions': maneuvers with instructions are returned. Default 'instructions'

#### Defined in

[src/valhalla/index.ts:104](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L104)

___

### id

• `Optional` **id**: `string`

A request ID that will be returned in the response

#### Inherited from

ValhallaBaseOpts.id

#### Defined in

[src/valhalla/index.ts:32](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L32)

___

### instructions

• `Optional` **instructions**: `boolean`

Whether to return turn-by-turn instructions. Named for compatibility with other
 providers. Valhalla's parameter here is 'narrative'.

#### Defined in

[src/valhalla/index.ts:80](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L80)

___

### language

• `Optional` **language**: `string`

The language of the narration instructions based on the IETF BCP 47 language tag string.
If no language is specified or the specified language is unsupported, United States-based
English (en-US) is used.

See here for a list of supported languages: [https://valhalla.readthedocs.io/en/latest/api/turn-by-turn/api-reference/#supported-language-tags](https://valhalla.readthedocs.io/en/latest/api/turn-by-turn/api-reference/#supported-language-tags)

#### Defined in

[src/valhalla/index.ts:99](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L99)

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

### units

• `Optional` **units**: [`ValhallaRequestUnit`](../modules.md#valhallarequestunit)

Distance units for output. Allowable unit types are miles (or mi) and kilometers (or km).
If no unit type is specified, the units default to kilometers.

#### Defined in

[src/valhalla/index.ts:91](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/index.ts#L91)
