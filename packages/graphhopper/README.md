# RoutingJS: GraphHopper

Promise-based web client for the [GraphHopper routing engine](https://www.graphhopper.com).

## Example

```js
import { GraphHopper } from "@routingjs/graphhopper"

const gh = new GraphHopper({ apiKey: "my-api-key" }) // URL defaults to https://api.openrouteservice.org
gh.directions(
    [
        [8.512516, 47.380742],
        [8.557835, 47.359467],
    ],
    "car"
).then((d) => {
    // do stuff with the directions response
    d.directions.forEach((direction) => {
        console.log(direction.feature)
    })
})
```

## Installation

```
npm install @routingjs/graphhopper
```

---

This package is part of the [RoutingJS project](https://github.com/gis-ops/routingjs), which aims to provide consistent access to various vehicle routing APIs.
