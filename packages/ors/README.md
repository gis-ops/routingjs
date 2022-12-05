# RoutingJS: ORS

Promise-based web client for [OpenRouteService](https://openrouteservice.org).

## Example

```js
import { ORS } from "@routingjs/ors"

const ors = new ORS({ apiKey: "my-api-key" }) // URL defaults to https://api.openrouteservice.org
ors.directions(
    [
        [8.512516, 47.380742],
        [8.557835, 47.359467],
    ],
    "driving-car"
).then((d) => {
    // do stuff with the directions response
    d.directions.forEach((direction) => {
        console.log(direction.feature)
    })
})
```

## Installation

```
npm install @routingjs/ors
```

---

This package is part of the [RoutingJS project](https://github.com/gis-ops/routingjs), which aims to provide consistent access to various vehicle routing APIs.
