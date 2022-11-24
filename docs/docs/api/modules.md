---
id: "modules"
title: "routing-js"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Classes

- [GraphHopper](classes/GraphHopper.md)
- [ORS](classes/ORS.md)
- [OSRM](classes/OSRM.md)
- [Valhalla](classes/Valhalla.md)

## Interfaces

- [GraphHopperIsochroneGetParams](interfaces/GraphHopperIsochroneGetParams.md)
- [GraphHopperIsochroneOpts](interfaces/GraphHopperIsochroneOpts.md)
- [GraphHopperIsochroneParams](interfaces/GraphHopperIsochroneParams.md)
- [GraphHopperIsochroneResponse](interfaces/GraphHopperIsochroneResponse.md)
- [GraphHopperMatrixOpts](interfaces/GraphHopperMatrixOpts.md)
- [GraphHopperMatrixParams](interfaces/GraphHopperMatrixParams.md)
- [GraphHopperMatrixResponse](interfaces/GraphHopperMatrixResponse.md)
- [GraphHopperRouteParams](interfaces/GraphHopperRouteParams.md)
- [GraphHopperRouteResponse](interfaces/GraphHopperRouteResponse.md)
- [ORSAlternateRouteParam](interfaces/ORSAlternateRouteParam.md)
- [ORSDirectionsOpts](interfaces/ORSDirectionsOpts.md)
- [ORSIsochroneOpts](interfaces/ORSIsochroneOpts.md)
- [ORSIsochroneParams](interfaces/ORSIsochroneParams.md)
- [ORSIsochroneResponse](interfaces/ORSIsochroneResponse.md)
- [ORSMatrixOpts](interfaces/ORSMatrixOpts.md)
- [ORSMatrixParams](interfaces/ORSMatrixParams.md)
- [ORSMatrixResponse](interfaces/ORSMatrixResponse.md)
- [ORSRouteParams](interfaces/ORSRouteParams.md)
- [ORSRouteResponse](interfaces/ORSRouteResponse.md)
- [OSRMDirectionsOpts](interfaces/OSRMDirectionsOpts.md)
- [OSRMMatrixOpts](interfaces/OSRMMatrixOpts.md)
- [ValhallaContours](interfaces/ValhallaContours.md)
- [ValhallaCostingOptsAuto](interfaces/ValhallaCostingOptsAuto.md)
- [ValhallaCostingOptsBicycle](interfaces/ValhallaCostingOptsBicycle.md)
- [ValhallaCostingOptsMotorcycle](interfaces/ValhallaCostingOptsMotorcycle.md)
- [ValhallaCostingOptsPedestrian](interfaces/ValhallaCostingOptsPedestrian.md)
- [ValhallaCostingOptsTruck](interfaces/ValhallaCostingOptsTruck.md)
- [ValhallaDateTime](interfaces/ValhallaDateTime.md)
- [ValhallaDirectionOpts](interfaces/ValhallaDirectionOpts.md)
- [ValhallaIsochroneOpts](interfaces/ValhallaIsochroneOpts.md)
- [ValhallaIsochroneParams](interfaces/ValhallaIsochroneParams.md)
- [ValhallaIsochroneResponse](interfaces/ValhallaIsochroneResponse.md)
- [ValhallaLocation](interfaces/ValhallaLocation.md)
- [ValhallaMatrixOpts](interfaces/ValhallaMatrixOpts.md)
- [ValhallaMatrixParams](interfaces/ValhallaMatrixParams.md)
- [ValhallaMatrixResponse](interfaces/ValhallaMatrixResponse.md)
- [ValhallaRouteParams](interfaces/ValhallaRouteParams.md)
- [ValhallaRouteResponse](interfaces/ValhallaRouteResponse.md)

## Type Aliases

### GraphHopperDirectionsOpts

Ƭ **GraphHopperDirectionsOpts**: `Omit`<[`GraphHopperRouteParams`](interfaces/GraphHopperRouteParams.md), ``"points"`` \| ``"profile"``\>

#### Defined in

[src/graphhopper/index.ts:20](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/index.ts#L20)

___

### GraphHopperProfile

Ƭ **GraphHopperProfile**: ``"car"`` \| ``"car_delivery"`` \| ``"car_avoid_ferry"`` \| ``"car_avoid_motorway"`` \| ``"car_avoid_toll"`` \| ``"small_truck"`` \| ``"small_truck_delivery"`` \| ``"truck"`` \| ``"scooter"`` \| ``"scooter_delivery"`` \| ``"foot"`` \| ``"hike"`` \| ``"bike"`` \| ``"mtb"`` \| ``"racingbike"``

#### Defined in

[src/graphhopper/parameters.ts:81](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/graphhopper/parameters.ts#L81)

___

### ORSAttribute

Ƭ **ORSAttribute**: ``"avgspeed"`` \| ``"detourfactor"`` \| ``"percentage"``

#### Defined in

[src/ors/parameters.ts:70](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/parameters.ts#L70)

___

### ORSExtraInfo

Ƭ **ORSExtraInfo**: ``"steepness"`` \| ``"suitability"`` \| ``"surface"`` \| ``"waycategory"`` \| ``"waytype"`` \| ``"tollways"`` \| ``"traildifficulty"`` \| ``"roadaccessrestrictions"``

#### Defined in

[src/ors/parameters.ts:71](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/parameters.ts#L71)

___

### ORSFormat

Ƭ **ORSFormat**: ``"geojson"`` \| ``"json"``

#### Defined in

[src/ors/parameters.ts:81](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/parameters.ts#L81)

___

### ORSInstructionFormat

Ƭ **ORSInstructionFormat**: ``"html"`` \| ``"text"``

#### Defined in

[src/ors/parameters.ts:80](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/parameters.ts#L80)

___

### ORSIsoAttribute

Ƭ **ORSIsoAttribute**: ``"area"`` \| ``"reachfactor"`` \| ``"total_pop"``

#### Defined in

[src/ors/parameters.ts:82](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/parameters.ts#L82)

___

### ORSPreference

Ƭ **ORSPreference**: ``"fastest"`` \| ``"shortest"`` \| ``"recommended"``

#### Defined in

[src/ors/parameters.ts:68](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/parameters.ts#L68)

___

### ORSProfile

Ƭ **ORSProfile**: ``"driving-car"`` \| ``"driving-hgv"`` \| ``"foot-walking"`` \| ``"foot-hiking"`` \| ``"cycling-regular"`` \| ``"cycling-road"`` \| ``"cycling-mountain"`` \| ``"cycling-electric"``

#### Defined in

[src/ors/parameters.ts:3](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/parameters.ts#L3)

___

### ORSUnit

Ƭ **ORSUnit**: ``"m"`` \| ``"km"`` \| ``"mi"``

#### Defined in

[src/ors/parameters.ts:69](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/ors/parameters.ts#L69)

___

### ValhallaCostingType

Ƭ **ValhallaCostingType**: ``"auto"`` \| ``"bicycle"`` \| ``"motorcycle"`` \| ``"truck"`` \| ``"pedestrian"``

#### Defined in

[src/valhalla/parameters.ts:285](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/parameters.ts#L285)

___

### ValhallaDirectionsType

Ƭ **ValhallaDirectionsType**: ``"none"`` \| ``"maneuvers"`` \| ``"instructions"``

#### Defined in

[src/valhalla/parameters.ts:147](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/parameters.ts#L147)

___

### ValhallaRequestUnit

Ƭ **ValhallaRequestUnit**: ``"mi"`` \| ``"km"`` \| ``"miles"`` \| ``"kilometers"``

#### Defined in

[src/valhalla/parameters.ts:26](https://github.com/chrstnbwnkl/routing-js/blob/dffa888/src/valhalla/parameters.ts#L26)
