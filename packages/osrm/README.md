# RoutingJS: OSRM

Promise-based web client for the [Open Source Routing Machine](https://project-osrm.org).

## Example

```js
import { OSRM } from "@routingjs/osrm"

const osrm = new OSRM() // URL defaults to https://routing.openstreetmap.de/routed-bike
osrm.directions([
    [8.512516, 47.380742],
    [8.557835, 47.359467],
]).then((d) => {
    // do stuff with the directions response
    d.directions.forEach((direction) => {
        console.log(direction.feature)
    })
})
```

## Installation

```
npm install @routingjs/osrm
```

---

This package is part of the [RoutingJS project](https://github.com/gis-ops/routingjs), which aims to provide consistent access to various vehicle routing APIs.
