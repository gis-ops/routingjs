# Routing-js

_One lib to route them all_ in JavaScript/TypeScript! _Routing-js_ is a promise-based web client for accessing different
routing web services, analogous to our Python client [routingpy](https://github.com/gis-ops/routing-py). Get unified access to several routing services with the power of modern asynchronous JavaScript fully typed thanks to the power of TypeScript!

We currently support the following routers:

-   [Valhalla](https://github.com/valhalla/valhalla)
-   [OSRM](http://project-osrm.org)
-   [OpenRouteService](https://openrouteservice.org)
-   [GraphHopper](https://graphhopper.com)

Future support for other service (like the ones _routingpy_ is supporting) might come at a later stage.

## Installation

...

## Examples

```js
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

## Bundle

We use `lerna` to handle bundling the packages.
