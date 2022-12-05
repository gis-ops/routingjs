# Quickstart

## Installation

Install single client classes:

```sh
npm i @routingjs/valhalla @routingjs/osrm @routingjs/ors @routingjs/graphhopper
```

## Directions

All clients support the `.directions()` method:

```js
import { Valhalla } from "@routingjs/valhalla"

const v = new Valhalla() // URL defaults to http://valhalla1.openstreetmap.de
v.directions(
    [
        [8.512516, 47.380742],
        [8.557835, 47.359467],
    ],
    "auto"
).then((d) => {
    // do stuff with the directions response
    d.directions.forEach((direction) => {
        console.log(direction.feature)
    })
})
```

The result's `directions` property is an array of at least one route as GeoJSON LineString feature, and more if alternatives have been requested.

If you want to access the response as sent by the routing server, you can always access it using the `raw` property.

## Matrix

> Hint: GraphHopper only supports the `/matrix` endpoint in their own hosted version.

```js
import { Valhalla } from "@routingjs/valhalla"

const v = new Valhalla() // URL defaults to http://valhalla1.openstreetmap.de

v.matrix(
    [
        [1.51886, 42.5063],
        [1.53789, 42.51007],
    ],
    "auto"
).then((m) => {
    console.log(m.durations)
})
```

The returned `Matrix` has `durations` and `distances` properties, and you can access the response via its `raw` property.

## Reachability

The `.reachability()` method is analogous to isochrone/isodistance analyses.

> Note: OSRM does not support this method.

```js
import { Valhalla } from "@routingjs/valhalla"

const v = new Valhalla() // URL defaults to http://valhalla1.openstreetmap.de

v.reachability([[1.51886, 42.5063]], "auto").then((i) => {
    i.isochrones.forEach((isochrone) => console.log(isochrone.feature))
})
```
