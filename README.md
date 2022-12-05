# RoutingJS

![example workflow](https://github.com/gis-ops/routingjs/actions/workflows/ci-tests.yml/badge.svg)

**One lib to route them all** : _RoutingJS_ is a promise-based web client for accessing different
routing web services, analogous to our Python client [routingpy](https://github.com/gis-ops/routing-py). Get unified access to several routing services with the power of modern asynchronous JavaScript fully typed thanks to the power of TypeScript!

We currently support the following routers:

-   [Valhalla](https://github.com/valhalla/valhalla)
-   [OSRM](http://project-osrm.org)
-   [OpenRouteService](https://openrouteservice.org)
-   [GraphHopper](https://graphhopper.com)

Future support for other service (like the ones _routingpy_ is supporting) might come at a later stage.

## Installation

Router clients are installable individually:

```
npm install @routingjs/valhalla
```

## Examples

RoutingJS offers `directions`, `matrix` and `reachability` methods where available (e.g. OSRM does not support reachability/isochrones).

```js
import { Valhalla } from "@routingjs/valhalla"

const v = new Valhalla() // URL defaults to http://valhalla1.openstreetmap.de
v.directions(
    [
        [47.380742, 8.512516], // pass as [lat, lon]
        [47.359467, 8.557835],
    ],
    "auto"
).then((d) => {
    // do stuff with the directions response
    d.directions.forEach((direction) => {
        console.log(direction.feature) // get the route as GeoJSON feature
        console.log(direction.feature.properties.distance) // get the route distance
        console.log(direction.feature.properties.duration) // get the route duration
    })
})

v.reachability([47.380742, 8.512516], "pedestrian", [30, 90]).then((i) => {
    i.isochrones.forEach((isochrone) => {
        console.log(i.interval) // 30/90
        console.log(i.intervalType) // "time"
        console.log(i.feature) // GeoJSON feature
    })
})

v.matrix(
    [
        [47.380742, 8.512516], // pass as [lat, lon]
        [47.359467, 8.557835],
    ],
    "auto"
).then((m) => {
    console.log(m.durations) // get the durations array for each location
    console.log(m.distances) // get the distances array for each location
})
```

## Documentation

See [here](https://gis-ops.github.io/routingjs/) for the full documentation.

## Contributing

Contributions are welcome! We are open to improvements of existing clients, as well as additions of
new ones :-)
